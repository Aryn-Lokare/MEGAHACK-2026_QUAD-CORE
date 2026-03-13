import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function checkStatuses() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT DISTINCT status FROM "User"');
    console.log('Statuses:', res.rows.map(r => r.status));
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await client.end();
  }
}

checkStatuses();
