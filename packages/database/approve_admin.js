import prisma from './src/lib/prisma.js';

async function main() {
  const result = await prisma.user.update({
    where: { email: 'aryanlokare233@gmail.com' },
    data: { status: 'APPROVED' }
  });
  console.log(`ADMIN APPROVED: ${result.email} | STATUS: ${result.status}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
