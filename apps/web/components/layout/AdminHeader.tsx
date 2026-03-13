"use client";

import { Bell, Mail, ChevronDown } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 gap-8">
      {/* Search Bar */}
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-black tracking-tight">
          Welcome back, <span className="text-[#0F62FE]">{user?.name?.split(' ')[0] || 'Admin'}</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-black relative">
            <Mail size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-black">
            <Bell size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-4 group cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-black">{user?.name || 'Jane Cooper'}</p>
            <p className="text-[11px] font-medium text-slate-500">{user?.email || 'admin@example.com'}</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden ring-2 ring-slate-200 group-hover:ring-[#0F62FE] transition-all">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-[#0F62FE]">{user?.name?.[0] || 'J'}</span>
              )}
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-black transition-colors" />
        </div>
      </div>
    </header>
  );
}
