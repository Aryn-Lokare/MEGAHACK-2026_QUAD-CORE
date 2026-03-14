import pkg from 'pg';
const { Client } = pkg;
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load env from current package or root
config({ path: resolve(__dirname, '.env') });

async function checkTable() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'StudyPlan'
      );
    `);

    console.log('Table "StudyPlan" exists:', res.rows[0].exists);

    if (!res.rows[0].exists) {
        console.log('Table does not exist. Creating it manually...');
        await client.query(`
            CREATE TABLE "public"."StudyPlan" (
                "id" TEXT NOT NULL,
                "studentId" TEXT NOT NULL,
                "plan" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('Table "StudyPlan" created successfully.');
    } else {
        console.log('Table already exists. No action needed.');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkTable();
