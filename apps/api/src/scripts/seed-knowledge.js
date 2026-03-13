/**
 * Seed script for AI Campus Assistant knowledge base.
 * Run this once to populate the database with campus knowledge.
 *
 * Usage (from project root):
 *   node apps/api/src/scripts/seed-knowledge.js
 *
 * Prerequisites:
 * 1. Run the SQL migration in Supabase SQL editor.
 * 2. Set DATABASE_URL in packages/database/.env
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env from packages/database (where DATABASE_URL lives)
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../../packages/database/.env') });

import prisma from '@repo/database';

const campusKnowledge = [
  { title: "AI Lab Location", content: "The AI Lab is located in Block B on the 3rd floor, Room 301." },
  { title: "Robotics Lab Location", content: "Robotics Lab is located in Block C on the 2nd floor, Room 201." },
  { title: "Library", content: "The campus library is located in the main building, Ground Floor. Open 8 AM–10 PM weekdays, 9 AM–6 PM weekends." },
  { title: "Computer Science Department", content: "The Computer Science department is in Block A, 1st floor." },
  { title: "Cafeteria", content: "The cafeteria is in Block D, Ground Floor. Open 7 AM to 9 PM." },
  { title: "Timetable - DBMS", content: "Database Management Systems (DBMS) class is every Monday and Wednesday at 2:00 PM in Lab 304." },
  { title: "Timetable - Data Structures", content: "Data Structures class is every Tuesday and Thursday at 11:00 AM in Lab 202." },
  { title: "Timetable - Machine Learning", content: "Machine Learning class is every Friday at 10:00 AM in the AI Lab, Block B Room 301." },
  { title: "DBMS Assignment", content: "The DBMS assignment on SQL Queries is due on 25 March 2026." },
  { title: "Data Structures Assignment", content: "The Data Structures assignment on Trees and Graphs is due on 20 March 2026." },
  { title: "Machine Learning Assignment", content: "The Machine Learning project submission deadline is 30 March 2026." },
  { title: "Campus WiFi", content: "Campus WiFi SSID is 'CampusNet'. Connect using your student ID and password." },
  { title: "Attendance Policy", content: "Students must maintain at least 75% attendance in each subject to be eligible for examinations." },
  { title: "Examination Schedule", content: "End semester examinations are scheduled from April 15 to April 30, 2026." },
  { title: "Hostel", content: "Student hostel is in Block H. Contact the warden at warden@campus.edu for room queries." },
];

async function seed() {
  console.log('Seeding campus knowledge base...');

  // Clear existing entries first, then insert fresh
  await prisma.campusKnowledge.deleteMany({});
  console.log('Cleared existing knowledge entries.');

  const result = await prisma.campusKnowledge.createMany({
    data: campusKnowledge,
  });

  console.log(`\n✅ Seeded ${result.count} knowledge entries successfully!`);
  await prisma.$disconnect();
}

seed();
