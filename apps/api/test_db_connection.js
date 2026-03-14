import prisma from '@repo/database';

async function test() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Successfully connected. Found users:', users.length);
    if (users.length > 0) {
        console.log('Sample user email:', users[0].email);
    }
  } catch (err) {
    console.error('Connection/Query failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
