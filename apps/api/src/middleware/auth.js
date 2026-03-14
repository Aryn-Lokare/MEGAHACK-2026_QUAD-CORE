import { createClient } from "@supabase/supabase-js"
import { createRequire } from 'module';
import prisma from "@repo/database"
import jwt from 'jsonwebtoken';
import fs from "fs"

import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, "../..", "debug.log");

const require = createRequire(import.meta.url);
const log = (msg) => {
  const line = `${new Date().toISOString()} - ${msg}\n`;
  fs.appendFileSync(logFile, line);
};

// Diagnostic logging for top-level env
log(`Top-level process.env.SUPABASE_URL set: ${!!process.env.SUPABASE_URL}`)

// Add jwt verification config
const jwtSecret = process.env.SUPABASE_JWT_SECRET;
log(`JWT Secret set: ${!!jwtSecret}`)

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      log(`[${req.method} ${req.url}] Auth failed: Missing header`)
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = header.split(" ")[1]
    
    // 1. Decode token to get user info regardless of algorithm (alg-agnostic)
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      log(`[${req.method} ${req.url}] Auth failed: Malformed token`)
      return res.status(401).json({ error: "Unauthorized: Invalid Token Format" });
    }

    const userEmail = decoded.email;
    log(`[${req.method} ${req.url}] Attempting auth for ${userEmail}`);

    // 2. Verify with Supabase SDK (Handles ES256/HS256 automatically)
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      log(` Supabase verify FAILED for ${userEmail}: ${error?.message || 'No user'}`);
      
      // OPTIONAL: In development, if we have a valid decoded session from our own Supabase URL, 
      // we might allow it even if the SDK is being flaky. But let's stay secure for now.
      return res.status(401).json({ error: `Unauthorized: ${error?.message || 'Invalid Session'}` });
    }

    // 3. JIT User Provisioning
    let dbUser = await prisma.user.findUnique({ where: { email: userEmail } })
    
    if (!dbUser) {
      log(`User ${userEmail} not found in DB - JIT creation starting`);
      
      const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
      const autoApproved = !adminExists 
      
      dbUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: decoded.user_metadata?.full_name || userEmail.split('@')[0],
          role: autoApproved ? 'ADMIN' : 'STUDENT',
          status: autoApproved ? 'APPROVED' : 'PENDING'
        }
      })
      log(`JIT Profile created for ${dbUser.email}`);
    }

    req.user = dbUser
    next()
  } catch (err) {
    log(`Unexpected auth error: ${err.message}`)
    return res.status(401).json({ error: "Unauthorized", details: err.message })
  }
}
