import prisma from './src/lib/prisma.js';

async function main() {
  console.log('Attempting to create StudyPlan table via Raw SQL...');
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."StudyPlan" (
          "id" TEXT NOT NULL,
          "studentId" TEXT NOT NULL,
          "plan" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Subject" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "syllabus" TEXT NOT NULL,
          CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Exam" (
          "id" TEXT NOT NULL,
          "subject" TEXT NOT NULL,
          "examDate" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('SUCCESS: All AI-related tables ensured.');

    // Also check if any other tables are missing if needed, but StudyPlan is the immediate blocker.
    
  } catch (err) {
    console.error('FAILURE:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
