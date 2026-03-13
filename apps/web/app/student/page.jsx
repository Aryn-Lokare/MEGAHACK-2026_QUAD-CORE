"use client"

import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function StudentDashboard() {
  const { signOut } = useAuth()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#030712] text-white p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-green-500/20">
              S
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
              <p className="text-gray-400 text-sm">Welcome back to Campus Nexus</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              await signOut()
              router.push("/")
            }}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">My Courses</h2>
            <p className="text-gray-400 text-sm mb-6">Access your study materials, assignments, and schedules.</p>
            <Link href="/student/courses" className="inline-flex items-center text-green-400 font-bold hover:gap-2 transition-all">
              Launch Learning Portal <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Academic Progress</h2>
            <p className="text-gray-400 text-sm mb-6">Track your grades, attendance, and overall performance.</p>
            <Link href="/student/progress" className="inline-flex items-center text-green-400 font-bold hover:gap-2 transition-all">
              View Grades <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
