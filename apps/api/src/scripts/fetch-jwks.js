import fetch from 'node-fetch';

const SUPABASE_URL = "https://adwblfqtrlvixsjjvqil.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkd2JsZnF0cmx2aXhzamp2cWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODcyNTUsImV4cCI6MjA4ODk2MzI1NX0.qByt-onxpbXMg9L6c415lXvVjMJwi3ePEQmA0JmUj74";

async function fetchJwks() {
  const urls = [
    `${SUPABASE_URL}/auth/v1/jwks`,
    `${SUPABASE_URL}/.well-known/jwks.json`
  ];

  for (const url of urls) {
    try {
      console.log(`TRYING: ${url}`);
      const res = await fetch(url, {
        headers: { 'apikey': ANON_KEY }
      });
      console.log('STATUS:' + res.status);
      const text = await res.text();
      console.log('BODY:' + text.substring(0, 100));
      if (res.ok) break;
    } catch (err) {
      console.error(err);
    }
  }
}

fetchJwks();
