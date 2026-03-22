import 'dotenv/config';
import express from "express"
import cors from "cors"
import prisma from "@repo/database"
import adminRouter from "./src/routes/admin.js"
import facultyRouter from "./src/routes/faculty.js"
import studentRouter from "./src/routes/student.js"
import analyticsRouter from "./src/routes/analyticsRoutes.js"
import aiRoutes from "./src/routes/ai.js"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = "n:/ai-campus-management/apps/api/debug.log";

const log = (msg) => {
  const line = `${new Date().toISOString()} - ${msg}\n`;
  fs.appendFileSync(logFile, line);
};

process.on("unhandledRejection", (reason, promise) => {
  log(`Unhandled Rejection at: ${promise} reason: ${reason}`);
});

process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

const app = express()
app.use(cors())
app.use(express.json())

// Request logger
app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
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

// Log relay for Next.js middleware (Edge Runtime)
app.post("/log-middleware", (req, res) => {
  const { msg } = req.body;
  if (msg) log(msg);
  res.sendStatus(200);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
