import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function listUsers() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT email, role, status FROM "User"');
    console.log('Database Users:');
    res.rows.forEach(r => console.log(`- ${r.email} (${r.role}, ${r.status})`));
  } catch (err) {
    console.error('Failed to list users:', err);
  } finally {
    await client.end();
  }
}

listUsers();
