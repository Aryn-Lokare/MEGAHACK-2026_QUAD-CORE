
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    console.log("Restoring core users...")
    
    // 1. Restore Admin
    const admin = await prisma.user.upsert({
      where: { email: 'aryanlokare233@gmail.com' },
      update: { role: 'ADMIN', status: 'APPROVED', name: 'Aryan Lokare' },
      create: { 
        email: 'aryanlokare233@gmail.com', 
        name: 'Aryan Lokare', 
        role: 'ADMIN', 
        status: 'APPROVED' 
      }
    })
    console.log(`Admin restored: ${admin.email}`)

    // 2. Restore Faculty (Soham)
    const faculty = await prisma.user.upsert({
      where: { email: 'sohamstamhankar1532@gmail.com' },
      update: { role: 'FACULTY', status: 'APPROVED', name: 'soham' },
      create: { 
        email: 'sohamstamhankar1532@gmail.com', 
        name: 'soham', 
        role: 'FACULTY', 
        status: 'APPROVED' 
      }
    })
    console.log(`Faculty restored: ${faculty.email}`)

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
