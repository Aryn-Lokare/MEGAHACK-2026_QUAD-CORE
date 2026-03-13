import { Router } from "express"
import { auth } from "../middleware/auth.js"
import { roles } from "../middleware/roles.js"

const router = Router()

// All authenticated users can access student routes
router.use(auth, roles(["STUDENT", "FACULTY", "ADMIN"]))

// GET student dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    message: "Welcome to Student Dashboard",
    user: req.user
  })
})

export default router
