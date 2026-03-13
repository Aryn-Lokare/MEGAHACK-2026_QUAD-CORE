import { createContext, useContext, useEffect, useState } from "react"
import { BASE_URL } from "@/constants/api"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => { },
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveUser = async (session) => {
      setLoading(true)
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        console.log("[AuthContext] Resolving user from session via:", `${BASE_URL}/auth/me`)
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const data = await res.json()
          console.log("[AuthContext] SUCCESS: User role is", data.role)
          setUser(data)
          console.log("[AuthContext] STATE: User object set in context.")
        } else {
          console.error("[AuthContext] FAILED to fetch /auth/me. Status:", res.status)
          setUser(null)
        }
      } catch (err) {
        console.error("[AuthContext] NETWORK ERROR fetch /auth/me:", err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => resolveUser(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthContext] Event:", event, "Session exists:", !!session)
      if (event === "SIGNED_OUT") {
        setUser(null)
        setLoading(false)
        return
      }
      resolveUser(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)