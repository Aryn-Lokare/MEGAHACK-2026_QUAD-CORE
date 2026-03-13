import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const apiEnvPath = '../../apps/api/.env';
const apiEnv = fs.readFileSync(apiEnvPath, 'utf8');

const getEnv = (key) => {
  const match = apiEnv.match(new RegExp(`${key}="?([^"\n]+)"?`));
  return match ? match[1] : null;
};

const DATABASE_URL = getEnv('DATABASE_URL');
const DIRECT_URL = getEnv('DIRECT_URL');

if (!DATABASE_URL || !DIRECT_URL) {
  console.error('Missing URLs in api/.env');
  process.exit(1);
}

try {
  console.log('Running prisma db pull...');
  
  execSync(`npx prisma db pull`, {
    env: { ...process.env, DATABASE_URL, DIRECT_URL },
    stdio: 'inherit'
  });
  console.log('SUCCESS: Schema pulled from DB');
  
  console.log('Running prisma generate...');
  execSync(`npx prisma generate`, {
    env: { ...process.env, DATABASE_URL, DIRECT_URL },
    stdio: 'inherit'
  });
  console.log('SUCCESS: Prisma client regenerated');

} catch (err) {
  console.error('FAILED', err.message);
  process.exit(1);
}
