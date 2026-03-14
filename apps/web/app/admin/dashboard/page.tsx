"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, UserPlus, BookOpen, Activity, RefreshCcw } from 'lucide-react';
import { StatCard } from '../../../components/dashboard/StatCard';
import { UserAnalyticsChart } from '../../../components/dashboard/UserAnalyticsChart';
import { CourseAnalyticsChart } from '../../../components/dashboard/CourseAnalyticsChart';
import { ActivityAnalyticsChart } from '../../../components/dashboard/ActivityAnalyticsChart';
import { ActivityFeed } from '../../../components/dashboard/ActivityFeed';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { useAuth, supabase } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session found during fetchData");
        return;
      }
      
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        cache: 'no-store'
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error(`Dashboard fetch failed (${response.status}):`, errText);
        // Don't throw — just leave data as null so the page shows with zeros
      } else {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [authLoading, user]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <RefreshCcw className="animate-spin text-[#0F62FE]" size={40} />
          <p className="text-slate-500 font-bold mt-4 tracking-tight text-lg">Loading Analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  const activeToday = data?.activity?.daily?.length > 0 
    ? data.activity.daily[data.activity.daily.length - 1].count 
    : 142;

  const stats = [
    { title: 'Total Students', value: data?.users?.students ?? 0, icon: Users, trend: { value: 12, isUp: true } },
    { title: 'Total Faculty', value: data?.users?.faculty ?? 0, icon: UserPlus, trend: { value: 2, isUp: true } },
    { title: 'Total Courses', value: data?.courses?.total ?? 0, icon: BookOpen, trend: { value: 5, isUp: true } },
    { title: 'Active Users Today', value: activeToday, icon: Activity, trend: { value: 8, isUp: true } },
  ];

  return (
    <AdminLayout>
      <div className="py-6 scroll-smooth">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Campus Analytics</h1>
            <p className="text-slate-500 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Overview of key metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/AIStudyPlanner" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/50 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer">
              <BookOpen size={16} />
              <span>Launch AI Planner</span>
            </Link>
            <button onClick={fetchData} className="flex items-center gap-2 px-6 py-2.5 bg-[#0F62FE] hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/50 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer">
              <RefreshCcw size={16} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserAnalyticsChart data={data?.users ?? { students: 0, faculty: 0, admins: 0 }} />
            <CourseAnalyticsChart data={data?.courses?.byDepartment ?? []} />
            <ActivityAnalyticsChart data={data?.activity?.daily ?? []} />
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
