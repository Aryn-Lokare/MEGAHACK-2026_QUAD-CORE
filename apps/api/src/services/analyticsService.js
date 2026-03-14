import prisma from '@repo/database';

export class AnalyticsService {
  async getDashboardMetrics() {
    try {
      console.log("Fetching dashboard metrics...");
      const totalStudents = await prisma.student.count() || 0;
      const totalCourses = await prisma.course.count() || 0;
      const assignmentsCount = await prisma.assignment.count() || 0;
      const submissions = await prisma.submission.findMany() || [];
      
      console.log(`Stats: ${totalStudents} students, ${totalCourses} courses, ${assignmentsCount} assignments, ${submissions.length} submissions`);

      const grades = submissions.filter(s => s.grade !== null && s.grade !== undefined).map(s => s.grade);
      const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      
      const totalPossibleSubmissions = assignmentsCount * totalStudents;
      const assignmentCompletionRate = totalPossibleSubmissions > 0 ? (submissions.length / totalPossibleSubmissions) * 100 : 0;
      
      const courseEngagementScore = 85; 

      return {
        totalStudents,
        totalCourses,
        assignmentCompletionRate: Math.round(assignmentCompletionRate),
        averageGrade: Math.round(averageGrade * 10) / 10,
        courseEngagementScore
      };
    } catch (error) {
      console.error("Error in getDashboardMetrics:", error);
      // Return defaults instead of throwing to prevent 500
      return {
        totalStudents: 0,
        totalCourses: 0,
        assignmentCompletionRate: 0,
        averageGrade: 0,
        courseEngagementScore: 0,
        error: error.message
      };
    }
  }

  async getStudentAnalytics(studentId) {
    const submissions = await prisma.submission.findMany({
      where: { userId: studentId } // mapping userId to student for now
    });

    const grades = submissions.filter(s => s.grade !== null).map(s => s.grade);
    const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    
    const totalAssignments = await prisma.assignment.count();
    const completionRate = totalAssignments > 0 ? (submissions.length / totalAssignments) * 100 : 0;
    const lateSubmissions = submissions.filter(s => s.late).length;
    const lateSubmissionRate = submissions.length > 0 ? (lateSubmissions / submissions.length) * 100 : 0;

    return {
      averageGrade: Math.round(averageGrade * 10) / 10,
      completionRate: Math.round(completionRate),
      lateSubmissionRate: Math.round(lateSubmissionRate),
      activityScore: 80 // Mock activity score for now
    };
  }

  async getPerformanceTrends() {
    return [
      { name: 'Week 1', average: 72 },
      { name: 'Week 2', average: 75 },
      { name: 'Week 3', average: 70 },
      { name: 'Week 4', average: 82 },
      { name: 'Week 5', average: 78 },
    ];
  }

  async getCompletionStats() {
    return [
      { name: 'On Time', value: 85 },
      { name: 'Missing', value: 10 },
      { name: 'Late', value: 5 },
    ];
  }
}

const analyticsService = new AnalyticsService();
export const getDashboardAnalytics = () => analyticsService.getDashboardMetrics();
export default analyticsService;
