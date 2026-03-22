import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { roles } from "../middleware/roles.js"
import prisma from "@repo/database"

import { ClassroomService } from "../services/classroomService.js"
import analyticsService from "../services/analyticsService.js"

const router = Router()

// FACULTY and ADMIN can access these routes
router.use(auth, roles(["FACULTY", "ADMIN"]))

// GET faculty dashboard data (Enriched with real metrics) 
router.get("/dashboard", async (req, res) => {
  try {
    const [metrics, trends, completion, activity] = await Promise.all([
      analyticsService.getDashboardMetrics(),
      analyticsService.getPerformanceTrends(),
      analyticsService.getCompletionStats(),
      analyticsService.getActivityPatterns()
    ]);

    res.json({
      metrics,
      trends,
      completion,
      activity,
      user: req.user
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// GET all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        assignments: true
      }
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create course
router.post("/courses", async (req, res) => {
  try {
    const { name, title, department } = req.body
    const course = await prisma.course.create({
      data: { name, title, department }
    })
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST sync classroom
router.post("/sync", async (req, res) => {
  try {
    const service = new ClassroomService()
    const result = await service.seedMockData()
    res.json({ message: "Sync successful", ...result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET list of students (with aggregated stats and predictions)
router.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany()
    console.log(`[API /students] Found ${students.length} raw students`);
    
    // Enrich students with stats and predictions
    const enrichedStudents = await Promise.all(students.map(async (s) => {
      const submissions = await prisma.submission.findMany({
        where: { userId: s.id }
      })
      
      const prediction = await prisma.prediction.findFirst({
        where: { studentId: s.id },
        orderBy: { createdAt: 'desc' }
      })

      const grades = submissions.filter(sub => sub.grade !== null).map(sub => sub.grade)
      const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0
      
      const totalAssignments = await prisma.assignment.count()
      const completionRate = totalAssignments > 0 ? (submissions.length / totalAssignments) * 100 : 0

      return {
        ...s,
        stats: {
          averageGrade: Math.round(avgGrade),
          completionRate: Math.round(completionRate)
        },
        prediction
      }
    }))

    console.log(`[API /students] Returning ${enrichedStudents.length} enriched students`);
    res.json(enrichedStudents)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
