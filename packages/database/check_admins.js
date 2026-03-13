import prisma from './src/lib/prisma.js';

async function main() {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  console.log(`ADMIN_COUNT: ${admins.length}`);
  admins.forEach(a => console.log(`ADMIN: ${a.email} | STATUS: ${a.status}`));
  
  const allUsers = await prisma.user.findMany();
  console.log(`TOTAL_USERS: ${allUsers.length}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
