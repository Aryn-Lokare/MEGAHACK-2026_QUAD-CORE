import { createClient } from "@supabase/supabase-js"
import prisma from "@repo/database"
import fs from "fs"

const logFile = "n:/ai-campus-management/apps/api/debug.log"
const log = (msg) => {
  const time = new Date().toISOString()
  fs.appendFileSync(logFile, `${time} - AUTH: ${msg}\n`)
}

// Create a Supabase client for server-side auth verification
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      log("Auth failed: Missing or invalid authorization header")
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = header.split(" ")[1]

    // Use Supabase's own getUser() - works with HS256, ES256, or any algorithm
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      log(`Supabase auth failed: ${error?.message ?? "No user returned"}`)
      return res.status(401).json({ error: "Unauthorized", details: error?.message ?? "Invalid token" })
    }

    log(`Supabase auth success: ${user.email}`)

    // Look up the user in our own database
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      log(`User ${user.email} not found in DB`)
      return res.status(401).json({ error: "User not found in database" })
    }

    log(`Auth success for ${dbUser.email} (${dbUser.role})`)
    req.user = dbUser
    next()
  } catch (err) {
    log(`Unexpected auth error: ${err.message}`)
    return res.status(401).json({ error: "Unauthorized", details: err.message })
  }
}
