import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { roles } from "../middleware/roles.js"
import prisma from "@repo/database"
import fs from "fs"
import path from "path"

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, "../..", "debug.log");
const log = (msg) => {
  const time = new Date().toISOString()
  fs.appendFileSync(logFile, `${time} - ${msg}\n`)
}

const router = Router()

// All admin routes require authentication + ADMIN role
router.use(auth, roles(["ADMIN"]))

// GET pending users (Moved up for specificity)
router.get("/users/pending", async (req, res) => {
  log(`GET /admin/users/pending called by ${req.user?.email}`)
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    log(`Found ${pendingUsers.length} pending users`)
    res.json(pendingUsers)
  } catch (error) {
    log(`Error in /users/pending: ${error.message}`)
    res.status(500).json({ error: "Failed to fetch pending users" })
  }
})

// GET all users
router.get("/users", async (req, res) => {
  log(`GET /admin/users called by ${req.user?.email}`)
  const users = await prisma.user.findMany()
  res.json(users)
})

// PATCH approve user
router.patch("/users/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'APPROVED' }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve user" });
  }
})

// PATCH reject user
router.patch("/users/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject user" });
  }
})

// GET all students
router.get("/students", async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    res.json(students)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" })
  }
})

// GET all faculty
router.get("/faculty", async (req, res) => {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: 'FACULTY' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    res.json(faculty)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculty" })
  }
})

// GET all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        faculty: {
          select: { name: true }
        }
      }
    })
    res.json(courses)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// PATCH user role
router.patch("/users/:id/role", async (req, res) => {
  const { id } = req.params
  const { role } = req.body

  if (!["ADMIN", "FACULTY", "STUDENT"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role }
  })
  res.json(user)
})

export default router
