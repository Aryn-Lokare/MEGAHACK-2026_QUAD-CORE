import express from "express"
import cors from "cors"
import prisma from "@repo/database"
import adminRouter from "./src/routes/admin.js"
import facultyRouter from "./src/routes/faculty.js"
import studentRouter from "./src/routes/student.js"

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

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Campus API running" })
})

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

// Protected role-based routes
app.use("/admin", adminRouter)
app.use("/faculty", facultyRouter)
app.use("/student", studentRouter)

<<<<<<< HEAD
const PORT = 5001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
=======
app.listen(5000, () => {
  console.log("Server running on port 5000")
>>>>>>> 625f70fd409a3b34b532b7d853d93b49ce57579b
})

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});
