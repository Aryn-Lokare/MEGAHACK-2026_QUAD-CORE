"use client";

import { AdminLayout } from '../../../components/layout/AdminLayout';
import { LogOut, Bell, Shield, User, Globe, Mail } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <AdminLayout>
      <div className="py-6 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">System Settings</h1>
          <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Manage your profile and account security</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden ring-4 ring-slate-50">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#0F62FE]">{user?.name?.[0] || 'A'}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">{user?.name || 'Administrator'}</h2>
                <p className="text-sm font-medium text-slate-500">{user?.email || 'admin@example.com'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 rounded-md bg-blue-50 text-[#0F62FE] text-[10px] font-extrabold uppercase tracking-widest border border-blue-100">
                    {user?.role || 'ADMIN'}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-100">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
              <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/50 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-[#0F62FE] group-hover:bg-white shadow-sm transition-all text-slate-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">Edit Profile</p>
                  <p className="text-[11px] text-slate-500">Update your details</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/50 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-[#0F62FE] group-hover:bg-white shadow-sm transition-all text-slate-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">Email Config</p>
                  <p className="text-[11px] text-slate-500">Change notification email</p>
                </div>
              </button>
            </div>
          </div>

          {/* Security & System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <Shield size={16} className="text-[#0F62FE]" />
                Security
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all">Enable 2FA Authentication</button>
                <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all">Login Activity Log</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <Globe size={16} className="text-[#0F62FE]" />
                App Preferences
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all">Language: English</button>
                <button className="w-full text-left p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all">Theme: Modern Light</button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-red-600">Session Management</h3>
              <p className="text-xs font-medium text-red-400 mt-1">Safely terminate your current session on this device.</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition-all font-bold text-sm tracking-tight"
            >
              <LogOut size={18} />
              Logout from Account
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
