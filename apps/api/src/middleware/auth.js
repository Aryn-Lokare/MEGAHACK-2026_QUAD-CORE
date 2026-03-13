import jwt from "jsonwebtoken"
import prisma from "@repo/database"
import jwksClient from "jwks-rsa"

const client = jwksClient({
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10
});

function getKey(header, callback) {
  if (header.alg === 'HS256') {
     const secret = process.env.SUPABASE_JWT_SECRET;
     // Try both raw and base64 for HS256 as fallback
     callback(null, secret);
  } else {
    client.getSigningKey(header.kid, function(err, key) {
      if (err) {
        callback(err);
      } else {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      }
    });
  }
}

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = header.split(" ")[1]
    const secret = process.env.SUPABASE_JWT_SECRET
    
    // 1. Verify JWT
    jwt.verify(token, getKey, { algorithms: ['HS256', 'ES256'] }, async (err, decoded) => {
      try {
        if (err) {
          console.error("[AUTH ERROR] JWT verify failed:", err.message);
          
          // Final fallback: If HS256 verify failed with raw string, try base64 manually
          if (err.message === 'invalid signature' || err.message === 'invalid algorithm') {
             try {
               const decodedSecret = Buffer.from(secret, 'base64');
               const manualDecoded = jwt.verify(token, decodedSecret, { algorithms: ['HS256'] });
               return await handleVerifiedUser(manualDecoded, req, res, next);
             } catch (e) {
               console.error("[AUTH ERROR] All verification methods failed.");
               return res.status(401).json({ error: "Unauthorized", details: "Invalid token" });
             }
          }
          
          return res.status(401).json({ error: "Unauthorized", details: err.message });
        }

        await handleVerifiedUser(decoded, req, res, next);
      } catch (callbackErr) {
        console.error("[AUTH ERROR] Exception in verify callback:", callbackErr);
        res.status(500).json({ error: "Internal server error during authentication" });
      }
    });

  } catch (err) {
    console.error("[AUTH ERROR] Auth middleware caught error:", err);
    return res.status(401).json({ error: "Unauthorized", details: err.message })
  }
}

async function handleVerifiedUser(decoded, req, res, next) {
  const email = decoded.email
  if (!email) {
    console.error("[AUTH ERROR] No email found in JWT claims.")
    return res.status(401).json({ error: "Unauthorized", details: "No email in token" })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`[AUTH ERROR] User NOT FOUND in database for email: ${email}`)
    return res.status(401).json({ error: "Unauthorized", details: `User ${email} not found in campus database` })
  }

  console.log(`[AUTH SUCCESS] User ${email} verified. Status: ${user.status}, Role: ${user.role}`)
  req.user = user
  next()
}
