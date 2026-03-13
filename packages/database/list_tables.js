
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
