import prisma from '@repo/database';

async function main() {
  console.log("🌱 Expanding Faculty Seed Data...");

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

    // 2. Expand Student List (15 Students)
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
    console.log(`Students Seeded: ${students.length}`);

    // 3. More Assignments (6 Total)
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
    console.log(`Assignments Seeded: ${assignments.length}`);

    // 4. Generate Varied Submissions
    console.log("Generating submissions...");
    for (const student of students) {
      for (const ass of assignments) {
        // Random performance patterns
        let grade, late;
        
        if (student.attendance > 90) { // Top performers
            grade = 85 + Math.floor(Math.random() * 15);
            late = Math.random() > 0.9;
        } else if (student.attendance < 60) { // At risk
            grade = 30 + Math.floor(Math.random() * 40);
            late = Math.random() > 0.4;
        } else { // Average
            grade = 65 + Math.floor(Math.random() * 25);
            late = Math.random() > 0.8;
        }

        // Skip some submissions for at-risk students
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

    // 5. Generate AI Predictions based on stats
    console.log("Updating AI Predictions...");
    for (const student of students) {
        // Calculate basic stats for seeding purposes
        const subs = await prisma.submission.findMany({ where: { userId: student.id } });
        const avg = subs.length > 0 ? subs.reduce((acc, s) => acc + (s.grade || 0), 0) / subs.length : 0;
        const missing = assignments.length - subs.length;
        
        let risk, predicted, rec;
        if (avg > 85 && missing === 0) {
            risk = 'Low'; predicted = 'A'; rec = 'Exceptional performance. Keep it up.';
        } else if (avg < 50 || missing > 2) {
            risk = 'High'; predicted = 'F'; rec = 'High risk of failure. Urgent intervention required.';
        } else if (avg < 70 || missing > 0) {
            risk = 'Medium'; predicted = 'C'; rec = 'Moderate risk. Suggest remedial sessions.';
        } else {
            risk = 'Low'; predicted = 'B'; rec = 'On track. Encourage more participation.';
        }

        await prisma.prediction.create({
            data: {
                studentId: student.id,
                riskLevel: risk,
                predictedGrade: predicted,
                recommendation: rec
            }
        });
    }

    console.log("✅ Data expansion complete!");
  } catch (err) {
    console.error("❌ Expansion failed!");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
