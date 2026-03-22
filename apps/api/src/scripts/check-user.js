import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'sohamstamhankar1532@gmail.com' }
    });
    if (user) {
      console.log('USER_EMAIL:' + user.email);
      console.log('USER_ROLE:' + user.role);
      console.log('USER_STATUS:' + user.status);
    } else {
      console.log('USER_NOT_FOUND');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
