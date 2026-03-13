import { Router } from "express";
import { getDashboardAnalytics } from "../services/analyticsService.js";
import { auth } from "../middleware/auth.js";
import { roles } from "../middleware/roles.js";

const router = Router();

// Protect analytics with ADMIN role
router.get("/dashboard", auth, roles(["ADMIN"]), async (req, res) => {
  try {
    const data = await getDashboardAnalytics();
    res.json(data);
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
