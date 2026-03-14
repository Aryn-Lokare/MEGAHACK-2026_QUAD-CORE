import express from 'express';
import analyticsService from '../services/analyticsService.js';
import { PredictionService } from '../services/predictionService.js';
import { ClassroomService } from '../services/classroomService.js';
import prisma from '@repo/database';

const router = express.Router();
const predictionService = new PredictionService();

router.get('/dashboard', async (req, res) => {
  try {
    const metrics = await analyticsService.getDashboardMetrics();
    const trends = await analyticsService.getPerformanceTrends();
    const completion = await analyticsService.getCompletionStats();
    
    const activity = [
      { id: 1, type: 'SUBMISSION', user: 'James Wilson', course: 'Computing Fundamentals', time: '2 mins ago' },
      { id: 2, type: 'GRADE', user: 'Sarah Parker', course: 'AI Essentials', time: '15 mins ago' },
    ];

    res.json({ metrics, trends, completion, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const classroomService = new ClassroomService(); 
    
    // Trigger mock seed for this development prototype
    const result = await classroomService.seedMockData();

    res.json({ 
      message: 'Sync completed successfully', 
      details: `Seeded ${result.studentCount} students for course: ${result.course.name}`,
      timestamp: new Date() 
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { assignments: true }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const { name, title, department } = req.body;
    if (!name || !department) {
      return res.status(400).json({ error: "Name and department are required" });
    }

    const course = await prisma.course.create({
      data: {
        name,
        title,
        department,
      }
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/students', async (req, res) => {
    try {
      const students = await prisma.student.findMany();
      
      const results = await Promise.all(students.map(async (student) => {
        const stats = await analyticsService.getStudentAnalytics(student.id);
        const prediction = await predictionService.getLatestPrediction(student.id);
        
        return {
          ...student,
          stats,
          prediction
        };
      }));
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/student/:id/prediction', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const stats = await analyticsService.getStudentAnalytics(student.id);
    const prediction = await predictionService.predictStudentPerformance(student.id, stats);
    
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
