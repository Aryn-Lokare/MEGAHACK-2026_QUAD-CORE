import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get DATABASE_URL from api/.env
const apiEnvPath = '../../apps/api/.env';
const apiEnv = fs.readFileSync(apiEnvPath, 'utf8');
const dbUrlMatch = apiEnv.match(/DATABASE_URL="?([^"\n]+)"?/);
const directUrlMatch = apiEnv.match(/DIRECT_URL="?([^"\n]+)"?/);

if (!dbUrlMatch || !directUrlMatch) {
  console.error('Could not find DATABASE_URL or DIRECT_URL in api/.env');
  process.exit(1);
}

const dbUrl = dbUrlMatch[1];
const directUrl = directUrlMatch[1];
console.log('Found URLs, running prisma generate...');

try {
  execSync('npx prisma generate', {
    env: { ...process.env, DATABASE_URL: dbUrl, DIRECT_URL: directUrl },
    stdio: 'inherit'
  });
  console.log('SUCCESS: Prisma client regenerated');
} catch (err) {
  console.error('FAILED: prisma generate failed', err.message);
  process.exit(1);
}
