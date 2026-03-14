"use client";

import { Sidebar } from '../../../components/layout/Sidebar';
import { Settings, LogOut, User, Bell, Shield, Palette } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FacultySettings() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-inter font-bold uppercase tracking-widest text-xs">Loading Secure Profile...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  const settingsSections = [
    {
      title: "Account Profile",
      icon: User,
      description: "Manage your personal information and academic credentials.",
      items: [
        { label: "Full Name", value: user.name },
        { label: "Email Address", value: user.email },
        { label: "Department", value: user.department || "Computer Science" }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Configure how you receive alerts about student submissions and AI reports.",
      items: [
        { label: "Email Alerts", value: "Enabled" },
        { label: "Push Notifications", value: "Disabled" }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="text-electric-sapphire-500" size={28} />
                <h1 className="text-3xl font-extrabold text-black tracking-tight">Settings</h1>
              </div>
              <p className="text-slate-500 font-medium">Manage your faculty account and preferences</p>
            </div>
          </header>

          <div className="max-w-4xl mx-auto space-y-10">
            {settingsSections.map((section) => (
              <div key={section.title} className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-5 mb-8">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-electric-sapphire-500">
                    <section.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-black tracking-tight">{section.title}</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">{section.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {section.items.map((item) => (
                     <div key={item.label} className="space-y-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                        <div className="text-sm font-extrabold text-slate-900 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-slate-200 cursor-default">
                          {item.value}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            ))}

            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-10 text-slate-50 group-hover:text-rose-500/10 transition-colors">
                 <LogOut size={160} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-black mb-2 tracking-tight">Session Management</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 max-w-lg leading-relaxed">
                  Securely end your current session. You will need to re-authenticate to access the Faculty Dashboard and student AI insights.
                </p>
                
                <button 
                  onClick={() => signOut()}
                  className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 uppercase text-xs tracking-widest"
                >
                  <LogOut size={20} />
                  Sign Out of CampusAI
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
