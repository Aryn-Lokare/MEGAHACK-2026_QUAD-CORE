import { google } from 'googleapis';
import prisma from '@repo/database';

export class ClassroomService {
  constructor(auth) {
    this.classroom = google.classroom({ version: 'v1', auth });
  }

  async syncCourses() {
    try {
      if (!this.classroom) throw new Error("Classroom API not initialized");
      const response = await this.classroom.courses.list();
    const courses = response.data.courses || [];

    for (const course of courses) {
      await prisma.course.upsert({
        where: { googleClassroomId: course.id },
        update: { name: course.name, title: course.section },
        create: {
          name: course.name,
          title: course.section,
          department: course.descriptionHeading || 'General',
          googleClassroomId: course.id
        }
      });
    }
    return courses;
    } catch (error) {
      console.error("syncCourses failed:", error);
      return [];
    }
  }

  async syncStudents(courseId) {
    try {
      if (!this.classroom) throw new Error("Classroom API not initialized");
      const response = await this.classroom.courses.students.list({ courseId });
    const students = response.data.students || [];

    for (const student of students) {
      const profile = student.profile;
      await prisma.student.upsert({
        where: { email: profile.emailAddress },
        update: { name: profile.name.fullName },
        create: {
          name: profile.name.fullName,
          email: profile.emailAddress,
          department: 'General', // Default department
          attendance: 100 // Default attendance
        }
      });
    }
    return students;
    } catch (error) {
      console.error("syncStudents failed:", error);
      return [];
    }
  }

  async syncCourseWork(courseId) {
    try {
      if (!this.classroom) throw new Error("Classroom API not initialized");
      const response = await this.classroom.courses.courseWork.list({ courseId });
    const works = response.data.courseWork || [];

    for (const work of works) {
      const dbCourse = await prisma.course.findUnique({ where: { googleClassroomId: courseId } });
      if (!dbCourse) continue;

      await prisma.assignment.upsert({
        where: { googleCourseWorkId: work.id },
        update: { 
          title: work.title, 
          description: work.description,
          deadline: work.dueDate ? new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day) : null
        },
        create: {
          title: work.title,
          description: work.description,
          status: 'PUBLISHED',
          deadline: work.dueDate ? new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day) : null,
          googleCourseWorkId: work.id,
          courseId: dbCourse.id
        }
      });
    }
    return works;
    } catch (error) {
      console.error("syncCourseWork failed:", error);
      return [];
    }
  }

  async syncSubmissions(courseId, courseWorkId) {
    try {
      if (!this.classroom) throw new Error("Classroom API not initialized");
      const response = await this.classroom.courses.courseWork.studentSubmissions.list({ courseId, courseWorkId });
    const submissions = response.data.studentSubmissions || [];

    const dbAssignment = await prisma.assignment.findUnique({ where: { googleCourseWorkId: courseWorkId } });
    if (!dbAssignment) return [];

    for (const sub of submissions) {
      // Find the student by email or Classroom ID (assuming student info is handled)
      // For now, we use studentEmail which we'd get from a students.list call
      // Simplified for now: assume we have the email or create a placeholder
      
      await prisma.submission.upsert({
        where: { googleSubmissionId: sub.id },
        update: { 
          grade: sub.assignedGrade,
          status: sub.state,
          submittedAt: sub.updateTime ? new Date(sub.updateTime) : null
        },
        create: {
          assignmentId: dbAssignment.id,
          studentEmail: sub.userId, // Using userId as email placeholder for now
          googleSubmissionId: sub.id,
          grade: sub.assignedGrade,
          status: sub.state,
          submittedAt: sub.updateTime ? new Date(sub.updateTime) : null
        }
      });
    }
    return submissions;
    } catch (error) {
      console.error("syncSubmissions failed:", error);
      return [];
    }
  }

  async seedMockData() {
    console.log("🌱 Generating Mock Classroom Data...");
    try {
      // 1. Create/Update Course
      const course = await prisma.course.upsert({
        where: { googleClassroomId: 'dummy-course-101' },
        update: { name: 'Full Stack Development', title: 'FS-502' },
        create: {
          name: 'Full Stack Development',
          title: 'FS-502',
          department: 'CS',
          googleClassroomId: 'dummy-course-101'
        }
      });

      // 2. Students List
      const studentsData = [
        { name: 'Alice Thompson', email: 'alice@example.edu', department: 'CS', attendance: 98 },
        { name: 'Bob Richards', email: 'bob@example.edu', department: 'CS', attendance: 65 },
        { name: 'Charlie Davis', email: 'charlie@example.edu', department: 'CS', attendance: 88 },
        { name: 'Diana Prince', email: 'diana@example.edu', department: 'CS', attendance: 100 },
        { name: 'Ethan Hunt', email: 'ethan@example.edu', department: 'CS', attendance: 75 },
        { name: 'Fiona Gallagher', email: 'fiona@example.edu', department: 'CS', attendance: 92 },
        { name: 'George Miller', email: 'george@example.edu', department: 'CS', attendance: 50 },
        { name: 'Hannah Abbott', email: 'hannah@example.edu', department: 'CS', attendance: 99 },
        { name: 'Ian Wright', email: 'ian@example.edu', department: 'CS', attendance: 82 },
        { name: 'Julia Roberts', email: 'julia@example.edu', department: 'CS', attendance: 94 },
        { name: 'Kevin Hart', email: 'kevin@example.edu', department: 'CS', attendance: 40 },
        { name: 'Laura Palmer', email: 'laura@example.edu', department: 'CS', attendance: 85 },
        { name: 'Mike Ross', email: 'mike@example.edu', department: 'CS', attendance: 97 },
        { name: 'Nina Simone', email: 'nina@example.edu', department: 'CS', attendance: 91 },
        { name: 'Oscar Wilde', email: 'oscar@example.edu', department: 'CS', attendance: 78 }
      ];

      const students = [];
      for (const s of studentsData) {
        const student = await prisma.student.upsert({
          where: { email: s.email },
          update: { attendance: s.attendance },
          create: s
        });
        students.push(student);
      }

      // 3. Assignments
      const assignmentsMeta = [
        { id: 'work-001', title: 'HTML & CSS Basics' },
        { id: 'work-002', title: 'JavaScript & DOM' },
        { id: 'work-003', title: 'React Fundamentals' },
        { id: 'work-004', title: 'Backend with Prisma' },
        { id: 'work-005', title: 'AI Integration' },
        { id: 'work-006', title: 'Final Capstone' }
      ];

      const assignments = [];
      for (const a of assignmentsMeta) {
        const ass = await prisma.assignment.upsert({
          where: { googleCourseWorkId: a.id },
          update: { title: a.title },
          create: {
            title: a.title,
            googleCourseWorkId: a.id,
            status: 'PUBLISHED',
            courseId: course.id
          }
        });
        assignments.push(ass);
      }

      // 4. Submissions
      for (const student of students) {
        for (const ass of assignments) {
          let grade, late;
          if (student.attendance > 90) {
              grade = 85 + Math.floor(Math.random() * 15);
              late = Math.random() > 0.9;
          } else if (student.attendance < 60) {
              grade = 30 + Math.floor(Math.random() * 40);
              late = Math.random() > 0.4;
          } else {
              grade = 65 + Math.floor(Math.random() * 25);
              late = Math.random() > 0.8;
          }

          if (student.attendance < 60 && Math.random() > 0.7) continue;

          await prisma.submission.upsert({
            where: { googleSubmissionId: `sub-${student.email}-${ass.googleCourseWorkId}` },
            update: { grade, late },
            create: {
              googleSubmissionId: `sub-${student.email}-${ass.googleCourseWorkId}`,
              studentEmail: student.email,
              grade,
              late,
              status: 'RETURNED',
              assignmentId: ass.id,
              userId: student.id,
              submittedAt: new Date()
            }
          });
        }
      }

      // 5. Predictions (AI Powered)
      const { PredictionService } = await import('./predictionService.js');
      const predictionService = new PredictionService();

      for (const student of students) {
          const subs = await prisma.submission.findMany({ where: { userId: student.id } });
          const grades = subs.filter(s => s.grade !== null).map(s => s.grade);
          const avg = grades.length > 0 ? grades.reduce((acc, g) => acc + g, 0) / grades.length : 0;
          
          const completionRate = assignments.length > 0 ? (subs.length / assignments.length) * 100 : 0;
          const lateSubmissions = subs.filter(s => s.late).length;
          const lateRate = subs.length > 0 ? (lateSubmissions / subs.length) * 100 : 0;

          // Call the real AI prediction service
          await predictionService.predictStudentPerformance(student.id, {
              averageGrade: Math.round(avg),
              completionRate: Math.round(completionRate),
              lateSubmissionRate: Math.round(lateRate),
              activityScore: 85 // Standard activity score for synced data
          });
      }

      return { course, studentCount: students.length };
    } catch (error) {
      console.error("seedMockData failed:", error);
      throw error;
    }
  }
}
