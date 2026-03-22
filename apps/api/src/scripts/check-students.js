import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.student.count();
    console.log('STUDENT_COUNT:' + count);
    const predictions = await prisma.prediction.count();
    console.log('PREDICTION_COUNT:' + predictions);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
