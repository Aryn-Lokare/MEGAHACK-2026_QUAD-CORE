import prisma from '@repo/database';

async function test() {
  try {
    console.log("Checking connection...");
    const count = await prisma.user.count();
    console.log(`Connection successful. User count: ${count}`);
  } catch (err) {
    console.error("Connection failed!");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
