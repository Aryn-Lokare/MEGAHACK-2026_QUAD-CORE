"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Signup() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState("STUDENT")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminExists, setAdminExists] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-exists`)
        if (res.ok) {
          const data = await res.json()
          setAdminExists(data.exists)
          // If admin exists and ADMIN is selected, switch to STUDENT
          if (data.exists) setSelectedRole("STUDENT")
        }
      } catch (err) {
        console.error("Failed to check admin status", err)
      }
    }
    checkAdmin()
  }, [])

  const handleSignup = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setError(null)

    try {
      // 1. Sign up with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (signUpError) throw signUpError

      // 2. Create user profile in our DB via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role: selectedRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user profile")
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const roleConfigs = {
    ADMIN: {
      color: "bg-red-500",
      glow: "bg-red-500/10",
      label: "Administrator",
      disabled: adminExists
    },
    FACULTY: {
      color: "bg-blue-500",
      glow: "bg-blue-500/10",
      label: "Faculty Member",
      disabled: false
    },
    STUDENT: {
      color: "bg-green-500",
      glow: "bg-green-500/10",
      label: "Student",
      disabled: false
    }
  }

  // Success screen
  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-4 text-white">
        <div className="max-w-md text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Account Created!</h2>
          <p className="text-gray-400 text-sm">
            Please check your email (<span className="text-white font-medium">{email}</span>) for a confirmation link before signing in.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-4 selection:bg-blue-500/30 overflow-hidden text-white">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${roleConfigs[selectedRole].glow} blur-[120px] rounded-full transition-colors duration-1000`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${roleConfigs[selectedRole].glow} blur-[120px] rounded-full transition-colors duration-1000`} />
      </div>

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Nexus</span>
          </h1>
          <p className="text-gray-400 text-sm">Create your account to get started</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
          {(["ADMIN", "FACULTY", "STUDENT"]).map((role) => (
            <button
              key={role}
              disabled={roleConfigs[role].disabled}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative ${
                selectedRole === role
                  ? `${roleConfigs[role].color} text-white shadow-lg`
                  : "text-gray-500 hover:text-gray-300"
              } ${roleConfigs[role].disabled ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
            >
              {role}
              {role === "ADMIN" && adminExists && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Admin already exists" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              {roleConfigs[selectedRole].label} Sign Up
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              {selectedRole === "ADMIN" && adminExists
                ? "An administrator account is already registered."
                : "Join the campus digital ecosystem."}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-2xl bg-black/40 border border-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              placeholder="Full Name"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-2xl bg-black/40 border border-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              placeholder="Email address"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-2xl bg-black/40 border border-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
              placeholder="Password (min 6 chars)"
            />

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || (selectedRole === "ADMIN" && adminExists)}
              className={`w-full flex justify-center py-4 px-4 text-sm font-bold rounded-2xl text-white transition-all duration-300 disabled:opacity-50 ${roleConfigs[selectedRole].color} hover:brightness-110 active:scale-[0.98] shadow-xl`}
            >
              {authLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/" className="text-blue-400 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
