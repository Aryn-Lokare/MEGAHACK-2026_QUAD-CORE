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
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({
    metrics: {
      totalStudents: 0,
      totalCourses: 0,
      assignmentCompletionRate: 0,
      averageGrade: 0,
      courseEngagementScore: 0
    },
    trends: [],
    completion: []
  });
  const [students, setStudents] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    if (!session?.access_token) return;
    
    try {
      const headers = { 
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };

      const res = await fetch('/api/faculty/dashboard', { headers });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }

      const studentsRes = await fetch('/api/faculty/students', { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'FACULTY') {
      fetchData();
    }
  }, [user]);

  const handleSync = async () => {
    console.log("🔄 Sync initiated...");
    setSyncing(true);
    try {
      const res = await fetch('/api/faculty/sync', { 
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      console.log("📡 Sync Response:", result);
      
      if (res.ok) {
        setShowSyncSuccess(true);
        setLastSynced(new Date().toLocaleTimeString());
        
        // Wait 1s for DB to settle before refreshing
        setTimeout(async () => {
          await fetchData();
          setShowSyncSuccess(false);
          setSyncing(false);
        }, 1000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Sync failed with status:", res.status, errorData);
        setSyncing(false);
      }
    } catch (err) {
      console.error("❌ Sync network error:", err);
      setSyncing(false);
    }
  };

  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-electric-sapphire-500 border-t-transparent animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Faculty Hub...</p>
      </div>
    </div>
  );

  if (!user || user.role !== 'FACULTY') return null;

  const { metrics, trends, completion } = data;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900 selection:bg-electric-sapphire-500/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          {/* Header */}
          <header className="mb-10 flex justify-between items-center bg-slate-50/80 border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-1 rounded-lg bg-[#0F62FE]/10 text-[#0F62FE] text-[10px] font-extrabold uppercase tracking-widest border border-[#0F62FE]/20">
                  Professor Access
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Engine</span>
                {lastSynced && (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 transition-all duration-1000">
                    Synced {lastSynced}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Academic Overview</h1>
              <p className="text-slate-600 font-semibold leading-relaxed">Monitoring student performance and course engagement with AI-powered analytics</p>
            </div>
            
            <div className="flex gap-4 items-center">
               {showSyncSuccess && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500">
                   <Check size={16} />
                   Data Synchronized
                 </div>
               )}
               <button 
                  onClick={handleSync}
                  disabled={syncing}
                  className={`px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-xl transition-all flex items-center gap-3 hover:brightness-110 active:scale-95 ${
                    syncing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#0F62FE] to-[#6366F1] shadow-indigo-500/20'
                  }`}
               >
                 <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                 {syncing ? 'Syncing...' : 'Sync Data'}
               </button>
               <div className="h-12 w-[1px] bg-slate-200 mx-2" />
               <div className="flex items-center gap-3 pl-2">
                 <div className="text-right">
                   <p className="text-sm font-extrabold text-black leading-none">{user.name}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Faculty Member</p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-electric-sapphire-600 font-extrabold shadow-sm text-lg">
                   {user.name?.charAt(0)}
                 </div>
               </div>
            </div>
          </header>

          <div className="max-w-[1640px] mx-auto">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                title="Total Enrolled" 
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
                title="Avg Performance" 
                value={`${metrics.averageGrade}%`} 
                icon={Flame} 
                trend={{ value: 2.1, isUp: true }} 
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-10">
              <div className="xl:col-span-2 space-y-10">
                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-1 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <StudentPerformanceChart data={trends} />
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-1 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <AssignmentCompletionChart data={completion} />
                  </div>
                </div>
                
                {/* Prediction Table */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                  <StudentPredictionTable students={students} />
                </div>
              </div>

              <div className="space-y-10">
                 {/* Activity Chart */}
                 <div className="bg-white rounded-[2rem] border border-slate-200 p-1 shadow-sm">
                   <ActivityChart />
                 </div>
                 
                 {/* Activity Feed */}
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                   <ActivityFeed />
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
