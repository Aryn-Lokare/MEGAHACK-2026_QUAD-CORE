import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { roles } from "../middleware/roles.js"
import prisma from "@repo/database"

const router = Router()

// FACULTY and ADMIN can access these routes
router.use(auth, roles(["FACULTY", "ADMIN"]))

// GET faculty dashboard data
router.get("/dashboard", (req, res) => {
  res.json({
    message: "Welcome to Faculty Dashboard",
    user: req.user
  })
})

// GET list of students (accessible to faculty)
router.get("/students", async (req, res) => {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" }
  })
  res.json(students)
})

export default router
