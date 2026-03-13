import jwt from "jsonwebtoken"
import prisma from "@repo/database"

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = header.split(" ")[1]
    const secret = process.env.SUPABASE_JWT_SECRET
    if (!secret) throw new Error("SUPABASE_JWT_SECRET not configured")

    const decoded = jwt.verify(token, secret)
    const email = decoded.email

    if (!email) {
      return res.status(401).json({ error: "Invalid token: no email in claims" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "User not found in database" })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", details: err.message })
  }
}
