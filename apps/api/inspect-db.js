import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function inspectSchema() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `;

    const res = await client.query(query);
    console.log('User table columns:');
    res.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await client.end();
  }
}

inspectSchema();
