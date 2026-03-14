"use client"

import { useState } from "react"
import { useAuth, supabase } from "../../../src/context/AuthContext"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, AlertTriangle, Calendar, Clock, Edit3, Loader2 } from "lucide-react"

export default function StudyPlanner() {
  const { user } = useAuth()
  
  const [syllabus, setSyllabus] = useState("")
  const [weakSubjects, setWeakSubjects] = useState("")
  const [exams, setExams] = useState("")
  const [assignments, setAssignments] = useState("")
  const [hours, setHours] = useState("4")
  
  const [plan, setPlan] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generatePlan = async () => {
    if (!syllabus.trim()) {
      setError("Please provide your syllabus topics.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error("You must be logged in to generate a plan.")
      }
      const token = session.access_token
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/ai/study-plan/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          syllabus,
          weakSubjects,
          exams,
          assignments,
          hours
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate study plan.")
      }
      
      setPlan(data.plan)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6 mb-8">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Study Planner</h1>
            <p className="text-slate-500 font-medium mt-1">Generate a personalized daily study schedule using Groq AI.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Form Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 h-fit">
            
            <h2 className="text-xl font-bold border-b border-slate-100 pb-3 flex items-center gap-2">
              <Edit3 size={18} className="text-slate-400" />
              Study Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">📝 Syllabus Topics (Required)</label>
                <textarea
                  className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                  placeholder="E.g., Data Structures: Arrays, Lists, Trees. OS: Processes, Deadlocks..."
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <AlertTriangle size={14} className="text-amber-500" /> Weak Subjects
                </label>
                <textarea
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                  placeholder="E.g., Operating Systems, Dynamic Programming..."
                  value={weakSubjects}
                  onChange={(e) => setWeakSubjects(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={14} className="text-blue-500" /> Exam Dates
                  </label>
                  <textarea
                    className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                    placeholder="E.g., OS - 25 March"
                    value={exams}
                    onChange={(e) => setExams(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Edit3 size={14} className="text-emerald-500" /> Assignments
                  </label>
                  <textarea
                    className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                    placeholder="E.g., Project - 20 March"
                    value={assignments}
                    onChange={(e) => setAssignments(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock size={14} className="text-slate-500" /> Daily Study Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Generating Plan...</> : "✨ Generate AI Study Plan"}
            </button>
          </div>

          {/* Output Display Column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit min-h-[600px] flex flex-col">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-3 mb-4">
               Your Personalized Schedule
            </h2>
            
            <div className="flex-1 overflow-auto">
              {!plan && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20 px-4 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <BookOpen size={32} className="text-slate-300" />
                  </div>
                  <p>Fill out your details and click generate to build your smart study schedule.</p>
                </div>
              ) : loading ? (
                <div className="h-full flex flex-col items-center justify-center text-indigo-500 space-y-4 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="font-bold animate-pulse text-indigo-600">Analyzing Syllabus & Architecting Plan...</p>
                </div>
              ) : (
                <div className="prose prose-slate prose-indigo max-w-none text-sm leading-relaxed 
                  prose-th:bg-slate-50 prose-th:px-4 prose-th:py-3 prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-wider prose-th:text-slate-500 prose-th:border-b prose-th:border-slate-200
                  prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-slate-100 prose-td:text-slate-600
                  prose-table:border-collapse prose-table:w-full prose-table:rounded-xl prose-table:border prose-table:border-slate-200
                  prose-h3:text-indigo-600 prose-h3:mt-6 prose-h3:mb-2 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5 whitespace-pre-wrap">
                  <div className="overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
