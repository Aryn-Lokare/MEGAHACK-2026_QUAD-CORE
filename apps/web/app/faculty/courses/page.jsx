"use client";

import { Sidebar } from '../../../components/layout/Sidebar';
import { BookOpen, Search, Filter, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacultyCourses() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    title: '',
    department: 'Computer Science'
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/faculty/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/faculty/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewCourse({ name: '', title: '', department: 'Computer Science' });
        await fetchCourses();
      }
    } catch (err) {
      console.error("Failed to add course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-inter font-bold uppercase tracking-widest text-xs">Loading Course Catalog...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2">My Courses</h1>
              <p className="text-slate-500 font-medium">Manage and monitor your ongoing courses</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-electric-sapphire-500 text-white font-bold text-sm shadow-lg shadow-electric-sapphire-500/20 hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Course
            </button>
          </header>

          <div className="max-w-[1600px] mx-auto">
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search courses by name or code..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-sapphire-500/20 transition-all font-medium shadow-sm"
                />
              </div>
              <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-black hover:bg-slate-50 transition-all flex items-center gap-2 font-bold shadow-sm uppercase text-[10px] tracking-widest">
                <Filter size={18} />
                Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                  <BookOpen size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                    {searchTerm ? `No matches for "${searchTerm}"` : 'No courses found'}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    {searchTerm ? 'Try a different search term' : 'Sync with Google Classroom or add a manual course'}
                  </p>
                </div>
              ) : filteredCourses.map((course) => (
                <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-electric-sapphire-500/10 transition-all group cursor-pointer flex flex-col h-full">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-electric-sapphire-500 mb-8 group-hover:scale-110 group-hover:bg-electric-sapphire-500 group-hover:text-white transition-all duration-300">
                    <BookOpen size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-black mb-2 group-hover:text-electric-sapphire-600 transition-colors tracking-tight">{course.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{course.title || 'No description available for this course module.'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-slate-50 transition-colors">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-xl border-4 border-white bg-slate-50 flex items-center justify-center text-[10px] font-extrabold text-slate-400">
                        +12
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{course.assignments?.length || 0} Modules</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 overflow-hidden animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-electric-sapphire-50 rounded-xl flex items-center justify-center text-electric-sapphire-500">
                      <Plus size={20} />
                   </div>
                   <h2 className="text-2xl font-extrabold text-black tracking-tight">Add New Course</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={24} />
                </button>
             </div>

             <form onSubmit={handleAddCourse} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                   <input 
                      required
                      type="text" 
                      placeholder="e.g., Computer Architecture"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-sapphire-500/20 transition-all font-medium"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Course Code / Title</label>
                   <input 
                      type="text" 
                      placeholder="e.g., CS-301"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-sapphire-500/20 transition-all font-medium"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                   <select 
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-electric-sapphire-500/20 transition-all font-medium appearance-none cursor-pointer"
                   >
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Electrical Engineering</option>
                      <option>Mathematics</option>
                   </select>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-electric-sapphire-500 hover:bg-electric-sapphire-600 text-white font-extrabold rounded-2xl shadow-xl shadow-electric-sapphire-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Initialize Course'
                  )}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
