import prisma from './src/lib/prisma.js';

async function main() {
  const users = await prisma.user.findMany();
  users.forEach(user => {
    console.log(`${user.email} | ${user.role} | ${user.status}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
