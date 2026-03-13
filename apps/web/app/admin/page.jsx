"use client"

import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#030712] text-white p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-red-500/20">
              A
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
              <p className="text-gray-400 text-sm">System administration & control</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group">
            <h2 className="text-lg font-bold mb-2">User Access</h2>
            <p className="text-gray-400 text-xs mb-6">Manage roles and permissions.</p>
            <Link href="/admin/users" className="text-red-400 text-sm font-bold hover:underline">
              Manage Users →
            </Link>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group">
            <h2 className="text-lg font-bold mb-2">Faculty</h2>
            <p className="text-gray-400 text-xs mb-6">Course distribution & staff.</p>
            <Link href="/admin/faculty" className="text-red-400 text-sm font-bold hover:underline">
              View Staff →
            </Link>
          </div>

          <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group">
            <h2 className="text-lg font-bold mb-2">Analytics</h2>
            <p className="text-gray-400 text-xs mb-6">Engagement & performance.</p>
            <Link href="/admin/stats" className="text-red-400 text-sm font-bold hover:underline">
              View Stats →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
