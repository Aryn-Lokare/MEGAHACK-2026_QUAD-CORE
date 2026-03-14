"use client"

import { useAuth } from "../../src/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function FacultyDashboard() {
  const { signOut } = useAuth()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#030712] text-white p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              F
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
              <p className="text-gray-400 text-sm">Course & student oversight</p>
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
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all group">
            <h2 className="text-xl font-bold mb-2">My Courses</h2>
            <p className="text-gray-400 text-sm mb-6">Manage lectures, assignments, and curriculum.</p>
            <Link href="/faculty/courses" className="text-blue-400 font-bold hover:underline">
              Go to Courses →
            </Link>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all group">
            <h2 className="text-xl font-bold mb-2">Student Registry</h2>
            <p className="text-gray-400 text-sm mb-6">View lists and individual performance data.</p>
            <Link href="/faculty/students" className="text-blue-400 font-bold hover:underline">
              View Students →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
