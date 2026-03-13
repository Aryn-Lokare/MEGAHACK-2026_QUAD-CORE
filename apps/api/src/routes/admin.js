import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { roles } from "../middleware/roles.js"
import prisma from "@repo/database"

const router = Router()

// All admin routes require authentication + ADMIN role
router.use(auth, roles(["ADMIN"]))

// GET all users
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
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
