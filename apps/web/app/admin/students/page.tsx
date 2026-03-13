"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { GraduationCap, Mail, Calendar, Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../src/context/AuthContext';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/students', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Student Directory</h1>
            <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Manage all registered students</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
              <Filter size={16} className="text-slate-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-4"><div className="h-10 bg-slate-50 rounded-lg w-40" /></td>
                      <td className="px-8 py-4"><div className="h-4 bg-slate-50 rounded w-48" /></td>
                      <td className="px-8 py-4"><div className="h-4 bg-slate-50 rounded w-32" /></td>
                      <td className="px-8 py-4"><div className="h-6 bg-slate-50 rounded w-20" /></td>
                      <td className="px-8 py-4"><div className="h-8 bg-slate-50 rounded w-8 mx-auto" /></td>
                    </tr>
                  ))
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <GraduationCap size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Mail size={14} />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Calendar size={14} />
                          {new Date(student.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest">
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-600">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && students.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
