
import prisma from "@repo/database";

export const getDashboardAnalytics = async () => {
  const [students, faculty, admins, totalCourses, courses, dailyActivity] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "FACULTY" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.course.count(),
    prisma.course.findMany({
      select: { department: true }
    }),
    prisma.activity.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  // Group courses by department
  const byDepartment = courses.reduce((acc, course) => {
    acc[course.department] = (acc[course.department] || 0) + 1;
    return acc;
  }, {});

  // Simple daily activity grouping
  const activityMap = dailyActivity.reduce((acc, act) => {
    const date = act.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const daily = Object.entries(activityMap).map(([date, count]) => ({
    date,
    count
  }));

  return {
    users: { students, faculty, admins },
    courses: { 
      total: totalCourses, 
      byDepartment: Object.entries(byDepartment).map(([name, count]) => ({ name, count }))
    },
    activity: { daily }
  };
};
