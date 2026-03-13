import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveUser = async (session) => {
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/me?email=${session.user.email}`
        )
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => resolveUser(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      resolveUser(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
