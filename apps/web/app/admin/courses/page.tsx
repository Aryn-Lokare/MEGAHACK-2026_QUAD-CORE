"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { BookOpen, User, Search, Filter, MoreHorizontal, GraduationCap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../src/context/AuthContext';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/courses', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">College Courses</h1>
            <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Catalog of currently offered programs</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
              <Filter size={16} className="text-slate-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-50 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-50 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-slate-50 rounded w-full mb-3" />
                <div className="h-4 bg-slate-50 rounded w-2/3" />
              </div>
            ))
          ) : (
            courses.map((course) => (
              <div key={course.id} className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-black tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                        {course.code || 'CRS-404'}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 tracking-wider">DEPT: {course.department || 'GENERAL'}</p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-300">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <h2 className="text-md font-bold text-slate-700 mb-3 leading-tight">{course.name}</h2>
                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                  {course.description || 'No description available for this course.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                    <User size={14} className="text-blue-500" />
                    <span>{course.faculty?.name || 'Assigned Staff'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span>3 Credits</span>
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && courses.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No courses found in the catalog
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
