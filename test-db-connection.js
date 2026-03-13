import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

async function testConnection() {
  console.log('Testing with DATABASE_URL (Port 6543 pooling)...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    const userCount = await prisma.user.count();
    console.log('SUCCESS: Connected via pooler. User count:', userCount);
  } catch (err) {
    console.error('FAILED: Pooler connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\nTesting with DIRECT_URL (Port 5432 direct)...');
  const directPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL,
      },
    },
  });

  try {
    const userCount = await directPrisma.user.count();
    console.log('SUCCESS: Connected via direct host. User count:', userCount);
  } catch (err) {
    console.error('FAILED: Direct connection failed:', err.message);
  } finally {
    await directPrisma.$disconnect();
  }
}

testConnection();
