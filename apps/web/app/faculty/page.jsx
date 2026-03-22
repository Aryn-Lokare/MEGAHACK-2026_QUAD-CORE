"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FacultyPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/faculty/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-inter font-bold uppercase tracking-widest text-xs text-slate-400">
      Redirecting to Dashboard...
    </div>
  )
}
