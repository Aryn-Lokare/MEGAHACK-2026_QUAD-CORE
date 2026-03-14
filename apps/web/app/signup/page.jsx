"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { ShieldCheck, User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react"

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/admin-exists`)
        if (res.ok) {
          const data = await res.json()
          setAdminExists(data.exists)
          if (data.exists && selectedRole === "ADMIN") setSelectedRole("STUDENT")
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/users`, {
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
      color: "bg-red-600",
      glow: "bg-red-500/10",
      label: "Administrator",
      disabled: adminExists
    },
    FACULTY: {
      color: "bg-blue-600",
      glow: "bg-blue-500/10",
      label: "Faculty Member",
      disabled: false
    },
    STUDENT: {
      color: "bg-emerald-600",
      glow: "bg-emerald-500/10",
      label: "Student",
      disabled: false
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full opacity-60" />
        </div>

        <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
          <div className="bg-white/60 backdrop-blur-2xl border border-slate-200 rounded-3xl p-10 shadow-2xl border-t-slate-100">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 shadow-sm">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-3 tracking-tight">Account Created!</h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
              Join the campus ecosystem. Please check your email (<span className="text-black font-bold">{email}</span>) for a confirmation link before signing in.
            </p>
            <Link
              href="/"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F62FE] py-4 px-6 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]"
            >
              Sign In to Your Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
            Registration Successful
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 selection:bg-blue-500/30 overflow-hidden">
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
          <p className="text-slate-500 text-sm">Join the campus digital ecosystem</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl">
          {(["ADMIN", "FACULTY", "STUDENT"]).map((role) => (
            <button
              key={role}
              disabled={roleConfigs[role].disabled}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative ${
                selectedRole === role
                  ? `${roleConfigs[role].color} text-white shadow-lg`
                  : "text-slate-500 hover:text-black"
              } ${roleConfigs[role].disabled ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
            >
              {role}
              {role === "ADMIN" && adminExists && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Admin already exists" />
              )}
            </button>
          ))}
        </div>

        <div className={`bg-white/60 backdrop-blur-2xl border border-slate-200 rounded-3xl p-8 shadow-2xl transition-all duration-500 border-t-slate-100`}>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black font-extrabold tracking-tight">
              {roleConfigs[selectedRole].label} Registration
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              {selectedRole === "ADMIN" && adminExists
                ? "An administrator account is already registered."
                : "Create your account to get started"}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-2xl bg-white border border-slate-200 pl-12 pr-4 py-3.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                placeholder="Full Name"
              />
            </div>
            
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl bg-white border border-slate-200 pl-12 pr-4 py-3.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl bg-white border border-slate-200 pl-12 pr-4 py-3.5 text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                placeholder="Password (min 6 chars)"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs text-center font-bold">
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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 font-bold hover:underline decoration-blue-200 underline-offset-4 decoration-2">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          Authorized Registration Portal
        </p>
      </div>
    </main>
  )
}
