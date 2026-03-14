import prisma from '@repo/database';

async function main() {
  console.log('Attempting to ensure StudyPlan table exists in the API-connected database...');
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
    console.log('SUCCESS: StudyPlan table ensured.');

    // Verify it exists now
    const tables = await prisma.$queryRawUnsafe(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'StudyPlan'
    `);
    console.log('Verification check - table names found:', tables);

  } catch (err) {
    console.error('FAILURE:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
