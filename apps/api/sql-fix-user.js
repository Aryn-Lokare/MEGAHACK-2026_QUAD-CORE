import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function insertUser() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const email = 'student@campusai.edu';
    const name = 'Test Student';
    const role = 'STUDENT';

    // Upsert equivalent in SQL for the User table
    const query = `
      INSERT INTO "User" (id, email, name, role, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, NOW())
      ON CONFLICT (email) 
      DO UPDATE SET name = $2, role = $3
      RETURNING *;
    `;

    const res = await client.query(query, [email, name, role]);
    console.log('User inserted/updated:', res.rows[0]);

  } catch (err) {
    console.error('SQL Insertion failed:', err);
  } finally {
    await client.end();
  }
}

insertUser();
