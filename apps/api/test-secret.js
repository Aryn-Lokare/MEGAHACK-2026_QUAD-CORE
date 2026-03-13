import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const secret = process.env.SUPABASE_JWT_SECRET;
console.log('Secret length:', secret ? secret.length : 'MISSING');

// Dummy JWT signed by Supabase (simulated)
// For a real test, we'd need a token from the user, but we can check if the secret is valid base64
if (secret) {
  try {
    const buffer = Buffer.from(secret, 'base64');
    console.log('Secret is valid base64, decoded size:', buffer.length);
  } catch (e) {
    console.log('Secret is NOT base64 encoded or failed to decode');
  }
}
