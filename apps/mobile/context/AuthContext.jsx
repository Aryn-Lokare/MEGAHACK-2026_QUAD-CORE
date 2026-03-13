import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)

const AuthContext = createContext({
  user: null,
  loading: true,
  avatar: null,
  setAvatar: async (uri) => {},
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatar, setAvatarState] = useState(require("../assets/images/male_avtar/1.jpeg"))

  useEffect(() => {
    // Load persisted avatar
    const loadAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem("user_avatar")
        if (savedAvatar) {
          setAvatarState(JSON.parse(savedAvatar))
        }
      } catch (e) {
        console.warn("AsyncStorage is not available. This is normal if you haven't restarted the app after installing it.", e)
      }
    }
    loadAvatar()

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

  const setAvatar = async (uri) => {
    setAvatarState(uri) // Update UI immediately
    try {
      await AsyncStorage.setItem("user_avatar", JSON.stringify(uri))
    } catch (e) {
      console.warn("Could not save avatar to persistent storage. Please restart your dev server.", e)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const guestLogin = (role = "STUDENT") => {
    setUser({
      id: "guest-id",
      email: "guest@example.com",
      name: "Guest User",
      role: role,
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, avatar, setAvatar, signOut, guestLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
