import { Router } from "express";
import { getDashboardAnalytics } from "../services/analyticsService.js";
import { auth } from "../middleware/auth.js";
import { roles } from "../middleware/roles.js";

const router = Router();

// Protect analytics with ADMIN/FACULTY role
router.get("/dashboard", auth, async (req, res) => {
  try {
    let data;
    if (req.user.role === 'ADMIN') {
      const { getAdminDashboardAnalytics } = await import("../services/analyticsService.js");
      data = await getAdminDashboardAnalytics();
    } else {
      const service = (await import("../services/analyticsService.js")).default;
      const metrics = await service.getDashboardMetrics();
      const trends = await service.getPerformanceTrends();
      const completion = await service.getCompletionStats();
      const activity = await service.getActivityPatterns();
      
      data = { metrics, trends, completion, activity };
    }
    res.json(data);
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
