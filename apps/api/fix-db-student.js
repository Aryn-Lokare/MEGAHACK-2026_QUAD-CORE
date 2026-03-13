import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function createMockInDB() {
  const email = "student@campusai.edu";
  const name = "Test Student";
  const role = "STUDENT";

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role, name },
      create: {
        email,
        name,
        role,
      },
    });
    console.log('User created/updated in Prisma DB:', user);
  } catch (err) {
    console.error('DB creation failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createMockInDB();
