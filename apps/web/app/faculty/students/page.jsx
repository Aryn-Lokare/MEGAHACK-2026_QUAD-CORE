"use client";

import { Sidebar } from '../../../components/layout/Sidebar';
import { Users, Search, Filter, Mail, MoreVertical } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacultyStudents() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/faculty/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    }
    fetchStudents();
  }, []);

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-inter font-bold uppercase tracking-widest text-xs">Loading Student Registry...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2">Student Registry</h1>
              <p className="text-slate-500 font-medium">Manage and communicate with your students</p>
            </div>
            <div className="flex gap-4">
               {/* Communication shortcut could go here */}
            </div>
          </header>

          <div className="max-w-[1600px] mx-auto">
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-sapphire-500/20 transition-all font-medium shadow-sm"
                />
              </div>
              <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-black hover:bg-slate-50 transition-all flex items-center gap-2 font-bold shadow-sm uppercase text-[10px] tracking-widest">
                <Filter size={18} />
                Filter
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 font-bold">Student</th>
                    <th className="px-8 py-6 font-bold">Department</th>
                    <th className="px-8 py-6 font-bold text-center">Avg. Grade</th>
                    <th className="px-8 py-6 font-bold text-center">Attendance</th>
                    <th className="px-8 py-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center text-slate-400 font-medium">No students registered in your courses yet.</td>
                    </tr>
                  ) : students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-electric-sapphire-500/10 flex items-center justify-center text-electric-sapphire-600 font-bold group-hover:bg-electric-sapphire-500 group-hover:text-white transition-all">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest leading-none block w-fit">{s.department || 'Academic'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2 items-center">
                           <span className="text-sm font-extrabold text-slate-900">{s.stats?.averageGrade || 0}</span>
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-electric-sapphire-500" style={{ width: `${s.stats?.averageGrade || 0}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-sm font-extrabold ${s.attendance > 90 ? 'text-emerald-600' : s.attendance > 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {s.attendance}%
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-white hover:bg-electric-sapphire-500 transition-all border border-slate-100">
                            <Mail size={18} />
                          </button>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
