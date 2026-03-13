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

app.get("/", (req, res) => {
  res.send("<h1>🤖 Campus AI Assistant API is Running</h1><p>The backend is active and ready for requests.</p>");
});

app.use("/api/ai", aiRoutes)

app.post("/users", async (req, res) => {
  const { email, name, role } = req.body

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role
    }
  })

  res.json(user)
})

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(5000, '0.0.0.0', (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log("Server running on http://localhost:5000");
});

