import express from "express"
import prisma from "@repo/database"

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const app = express()
app.use(express.json())

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

const PORT = 5001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});
