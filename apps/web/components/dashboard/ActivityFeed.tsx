"use client";

import { Bell, FileText, CheckCircle2, BookOpen } from 'lucide-react';

const activities = [
  { id: 1, type: 'SUBMISSION', user: 'James Wilson', course: 'Computing Fundamentals', time: '2 mins ago', icon: FileText, color: 'text-blue-500' },
  { id: 2, type: 'GRADE', user: 'Sarah Parker', course: 'AI Essentials', time: '15 mins ago', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 3, type: 'COURSE', user: 'Prof. Miller', course: 'Material Updated', time: '1 hr ago', icon: BookOpen, color: 'text-purple-500' },
  { id: 4, type: 'SUBMISSION', user: 'Emily Davis', course: 'Computing Fundamentals', time: '2 hrs ago', icon: FileText, color: 'text-blue-500' },
];

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-black tracking-tight">Recent Activity</h3>
        <Bell size={20} className="text-slate-400" />
      </div>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 group cursor-default">
            <div className={`mt-1 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${activity.color} group-hover:bg-white group-hover:shadow-lg transition-all border border-transparent group-hover:border-slate-100`}>
              <activity.icon size={22} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-slate-900 leading-none">{activity.user}</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">{activity.time}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {activity.type === 'SUBMISSION' ? 'Submitted assignment in ' : 
                 activity.type === 'GRADE' ? 'Received grade in ' : 'New content in '} 
                <span className="font-bold text-slate-900">{activity.course}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 py-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-black transition-all">
        View All Notifications
      </button>
    </div>
  );
}
