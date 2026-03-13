import 'dotenv/config';
import express from "express"
import cors from "cors"
import prisma from "@repo/database"
import aiRoutes from "./src/routes/ai.js"

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const app = express()
app.use(cors())
app.use(express.json())

// Root: Health Check and Welcome
app.get("/", (req, res) => {
  res.send("<h1>🤖 Campus AI Assistant API is Running</h1><p>The backend is active and ready for requests.</p>");
});

app.use("/api/ai", aiRoutes)

// Check if an admin already exists
app.get("/admin-exists", async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })
    res.json({ exists: !!admin })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Public: create user (called after Supabase auth signup)
app.post("/users", async (req, res) => {
  try {
    const { email, name, role } = req.body

    // Enforce single admin rule
    if (role === "ADMIN") {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      })
      if (existingAdmin) {
        return res.status(403).json({ error: "An administrator account already exists." })
      }
    }

    const user = await prisma.user.create({
      data: { email, name, role }
    })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Public: get current user by email
app.get("/users/me", async (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ error: "email query param required" })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ error: "User not found" })
  res.json(user)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error("Failed to start server on port", PORT, err);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
