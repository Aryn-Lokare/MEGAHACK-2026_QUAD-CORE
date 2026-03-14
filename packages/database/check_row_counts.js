
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    const tables = [
      { name: 'User', prop: 'user' },
      { name: 'Course', prop: 'course' },
      { name: 'Activity', prop: 'activity' },
      { name: 'Assignment', prop: 'assignment' },
      { name: 'Submission', prop: 'submission' },
      { name: 'Prediction', prop: 'prediction' },
      { name: 'CampusKnowledge', prop: 'campusKnowledge' },
      { name: 'CampusLocation', prop: 'campusLocation' },
      { name: 'Student', prop: 'student' },
      { name: 'Timetable', prop: 'timetable' }
    ]
    
    console.log("ROW COUNTS:")
    for (const table of tables) {
      const count = await prisma[table.prop].count()
      console.log(`${table.name}: ${count}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
