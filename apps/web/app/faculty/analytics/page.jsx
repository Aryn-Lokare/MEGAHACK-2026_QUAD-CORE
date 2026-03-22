"use client";

import { Sidebar } from '../../../components/layout/Sidebar';
import { StudentPerformanceChart } from '../../../components/dashboard/StudentPerformanceChart';
import { AssignmentCompletionChart } from '../../../components/dashboard/AssignmentCompletionChart';
import { ActivityChart } from '../../../components/dashboard/ActivityChart';
import { StatCard } from '../../../components/dashboard/StatCard';
import { BarChart3, TrendingUp, CheckCircle, Flame } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacultyAnalytics() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchMetrics() {
      if (!session?.access_token) return;
      try {
        const res = await fetch('/api/faculty/dashboard', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
    }
    if (user && user.role === 'FACULTY' && session) {
      fetchMetrics();
    }
  }, [user, session]);

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-inter font-bold uppercase tracking-widest text-xs">Loading Analytics Engine...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  const metrics = data?.metrics || { totalStudents: 0, totalCourses: 0, assignmentCompletionRate: 0, averageGrade: 0, courseEngagementScore: 0 };

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2">Advanced Analytics</h1>
              <p className="text-slate-500 font-medium">Detailed insights into academic performance and engagement</p>
            </div>
            <button onClick={() => window.location.reload()} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
              <BarChart3 size={20} />
            </button>
          </header>

          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                title="Avg Assignment Score" 
                value={`${metrics.averageGrade || 0}%`} 
                icon={TrendingUp} 
                trend={{ value: 2.4, isUp: true }} 
              />
              <StatCard 
                title="Completion Rate" 
                value={`${metrics.assignmentCompletionRate || 0}%`} 
                icon={CheckCircle} 
                trend={{ value: 5.1, isUp: true }} 
              />
              <StatCard 
                title="Engagement Score" 
                value={`${metrics.courseEngagementScore || 0}%`} 
                icon={Flame} 
              />
              <StatCard 
                title="Performance Flux" 
                value="Stable" 
                icon={BarChart3} 
              />
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-extrabold text-black mb-6 tracking-tight">Student Performance Trend</h3>
                  <StudentPerformanceChart data={data?.trends} />
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-extrabold text-black mb-6 tracking-tight">Assignment Completion Analysis</h3>
                  <AssignmentCompletionChart data={data?.completion} />
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-black tracking-tight">Daily Activity Patterns</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Engagement trends over time</p>
                  </div>
                  <div className="flex gap-2">
                    {['7D', '30D', '90D'].map(t => (
                      <button key={t} className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${t === '7D' ? 'bg-electric-sapphire-500 text-white border-electric-sapphire-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <ActivityChart data={data?.activity} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
