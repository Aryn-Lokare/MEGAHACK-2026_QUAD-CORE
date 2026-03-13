import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'student@campusai.edu' }
    });
    console.log('User check:', user ? user : 'USER NOT FOUND');
  } catch (err) {
    console.error('DB check failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
