"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { StatCard } from '../../../components/dashboard/StatCard';
import { StudentPerformanceChart } from '../../../components/dashboard/StudentPerformanceChart';
import { AssignmentCompletionChart } from '../../../components/dashboard/AssignmentCompletionChart';
import { ActivityChart } from '../../../components/dashboard/ActivityChart';
import { StudentPredictionTable } from '../../../components/dashboard/StudentPredictionTable';
import { ActivityFeed } from '../../../components/dashboard/ActivityFeed';
import { Users, BookOpen, CheckCircle, Flame, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FacultyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalCourses: 0,
    assignmentCompletionRate: 0,
    courseEngagementScore: 0
  });
  const [students, setStudents] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/faculty/dashboard');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
        }

        const studentsRes = await fetch('/api/faculty/students');
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }
    fetchMetrics();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/faculty/sync', { method: 'POST' });
      if (res.ok) {
        setShowSyncSuccess(true);
        // Refresh data
        const [metricsRes, studentsRes] = await Promise.all([
          fetch('/api/faculty/dashboard'),
          fetch('/api/faculty/students')
        ]);
        if (metricsRes.ok) setMetrics((await metricsRes.json()).metrics);
        if (studentsRes.ok) setStudents(await studentsRes.json());
        
        setTimeout(() => setShowSyncSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-charcoal-blue-950 text-white">Loading Auth...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          {/* Header */}
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2">Faculty Dashboard</h1>
              <p className="text-slate-500 font-medium">Welcome back, <span className="text-electric-sapphire-500 font-bold">Prof. {user.name?.split(' ')[1] || user.name}</span></p>
            </div>
            <div className="flex gap-4 items-center">
               {showSyncSuccess && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-right-4 duration-500">
                   <Check size={16} />
                   Classroom Synced
                 </div>
               )}
               <button 
                  onClick={handleSync}
                  disabled={syncing}
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${
                    syncing ? 'bg-charcoal-blue-800 cursor-not-allowed' : 'bg-electric-sapphire-500 shadow-electric-sapphire-500/20'
                  }`}
               >
                 <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                 {syncing ? 'Syncing...' : 'Sync Classroom'}
               </button>
               <div className="w-12 h-12 rounded-xl bg-[#101827] border border-charcoal-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
                 {user.name?.charAt(0)}
               </div>
            </div>
          </header>

          <div className="max-w-[1600px] mx-auto">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                title="Total Students" 
                value={metrics.totalStudents} 
                icon={Users} 
                trend={{ value: 12, isUp: true }} 
              />
              <StatCard 
                title="Active Courses" 
                value={metrics.totalCourses} 
                icon={BookOpen} 
              />
              <StatCard 
                title="Completion Rate" 
                value={`${metrics.assignmentCompletionRate}%`} 
                icon={CheckCircle} 
                trend={{ value: 5, isUp: true }} 
              />
              <StatCard 
                title="Engagement" 
                value={`${metrics.courseEngagementScore}%`} 
                icon={Flame} 
                trend={{ value: 2, isUp: false }} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
              <div className="lg:col-span-2 space-y-10">
                {/* Main Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <StudentPerformanceChart />
                  <AssignmentCompletionChart />
                </div>
                
                {/* Prediction Table */}
                <StudentPredictionTable students={students} />
              </div>

              <div className="space-y-10">
                 {/* Activity Chart */}
                 <ActivityChart />
                 
                 {/* Activity Feed */}
                 <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
