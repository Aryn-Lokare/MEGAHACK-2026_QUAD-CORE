import express from "express"
import prisma from "@repo/database"

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

app.listen(5000, () => {
  console.log("Server running")
})
