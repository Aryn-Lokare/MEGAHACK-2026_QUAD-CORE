"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { useAuth } from "../src/context/AuthContext"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const stay = searchParams.get("stay")
  
  const [selectedRole, setSelectedRole] = useState("STUDENT")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already logged in, UNLESS "stay" param is present
  useEffect(() => {
    if (!loading && user && !stay) {
      // Set role cookie for server-side proxy route protection
      document.cookie = `userRole=${user.role}; path=/; SameSite=Lax`
      
      // Handle approval workflow routing
      if (user.role !== "ADMIN" && user.status === "PENDING") {
        router.push("/pending")
        return
      }
      
      if (user.role !== "ADMIN" && user.status === "REJECTED") {
        router.push("/rejected")
        return
      }

      if (user.role === "ADMIN") router.push("/admin/dashboard")
      else if (user.role === "FACULTY") router.push("/faculty")
      else router.push("/student")
    }
  }, [user, loading, router, stay])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setError("Supabase not configured")
      return
    }
    setAuthLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
    } catch (err) {
      setError(err.message)
      setAuthLoading(false)
    }
  }

  const roleConfigs = {
    ADMIN: {
      color: "bg-red-500",
      text: "text-red-400",
      border: "border-red-500/20",
      shadow: "shadow-red-500/10",
      glow: "bg-red-500/10",
      label: "Administrator"
    },
    FACULTY: {
      color: "bg-blue-500",
      text: "text-blue-400",
      border: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
      glow: "bg-blue-500/10",
      label: "Faculty Member"
    },
    STUDENT: {
      color: "bg-green-500",
      text: "text-green-400",
      border: "border-green-500/20",
      shadow: "shadow-green-500/10",
      glow: "bg-green-500/10",
      label: "Student"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${roleConfigs[selectedRole].glow} blur-[120px] rounded-full transition-colors duration-1000 opacity-60`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${roleConfigs[selectedRole].glow} blur-[120px] rounded-full transition-colors duration-1000 opacity-60`} />
      </div>

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Nexus</span>
          </h1>
          <p className="text-slate-500 text-sm">Select your role and sign in</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
          {(["ADMIN", "FACULTY", "STUDENT"]).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                selectedRole === role 
                  ? `${roleConfigs[role].color} text-white shadow-lg` 
                  : "text-slate-500 hover:text-black"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className={`bg-white/60 backdrop-blur-2xl border border-slate-200 rounded-3xl p-8 shadow-2xl transition-all duration-500 ${roleConfigs[selectedRole].shadow} border-t-slate-100`}>
          <div className="mb-8">
            <h2 className={`text-xl font-bold text-black transition-colors`}>
              {roleConfigs[selectedRole].label} Login
            </h2>
            <p className="text-slate-500 text-xs mt-1">Please enter your credentials below</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl bg-white border border-slate-200 px-4 py-3.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl bg-white border border-slate-200 px-4 py-3.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white transition-all duration-300 disabled:opacity-50 ${roleConfigs[selectedRole].color} hover:brightness-110 active:scale-[0.98] shadow-xl`}
            >
              {authLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                `Enter Dashboard`
              )}
            </button>
          </form>

          {user && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs text-center">
              Currently logged in as <strong>{user.email}</strong>. 
              <button 
                onClick={() => {
                  document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                  supabase.auth.signOut()
                  window.location.reload()
                }}
                className="ml-2 underline font-bold"
              >
                Logout
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center transition-all animate-in fade-in duration-1000 delay-500">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-bold hover:underline decoration-blue-600/30 underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          Authorized Access Only
        </p>
      </div>
    </main>
  )
}
