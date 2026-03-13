import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function checkData() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const query = `
      SELECT email, role, status FROM "User" LIMIT 5;
    `;

    const res = await client.query(query);
    console.log('Sample Users:');
    res.rows.forEach(row => console.log(JSON.stringify(row)));

  } catch (err) {
    console.error('Data check failed:', err);
  } finally {
    await client.end();
  }
}

checkData();
