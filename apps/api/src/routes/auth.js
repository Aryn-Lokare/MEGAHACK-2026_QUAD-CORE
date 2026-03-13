import { Router } from "express"
import { auth } from "../middleware/auth.js"
import prisma from "@repo/database"

const router = Router()

/**
 * GET /auth/me
 * Returns clean user info from the authenticated JWT
 */
router.get("/me", auth, async (req, res) => {
  try {
    const { id, name, email, role } = req.user
    res.json({ id, name, email, role })
  } catch (err) {
    console.error("Auth Me error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
