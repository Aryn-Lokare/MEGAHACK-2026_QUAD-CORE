const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Extract values from .env manually to be safe
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim().replace(/"/g, '');
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;
const jwtSecret = env.SUPABASE_JWT_SECRET;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY (length):', supabaseKey ? supabaseKey.length : 0);
console.log('SUPABASE_JWT_SECRET (length):', jwtSecret ? jwtSecret.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// Test health
supabase.from('User').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) console.error('Database Connectivity Test Failed:', error.message);
    else console.log('Database Connectivity Test Success! User count head:', count);
  })
  .catch(err => console.error('Connectivity Error:', err.message));
