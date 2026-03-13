import 'dotenv/config';
import express from "express"
import cors from "cors"
import prisma from "@repo/database"
import adminRouter from "./src/routes/admin.js"
import facultyRouter from "./src/routes/faculty.js"
import studentRouter from "./src/routes/student.js"
import analyticsRouter from "./src/routes/analyticsRoutes.js"
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

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." })
    }

    // Check if it's the very first admin to bypass approval
    let initialStatus = "PENDING";
    if (role === "ADMIN") {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      })
      if (existingAdmin) {
        return res.status(403).json({ error: "An administrator account already exists." })
      } else {
        initialStatus = "APPROVED"; // First admin is auto-approved
      }
    }

    const user = await prisma.user.create({
      data: { email, name, role, status: initialStatus }
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

// Protected role-based routes
app.use("/admin", adminRouter)
app.use("/faculty", facultyRouter)
app.use("/student", studentRouter)
app.use("/analytics", analyticsRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

const PORT = 5001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
