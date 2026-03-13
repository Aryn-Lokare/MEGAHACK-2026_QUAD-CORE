"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthContext';
import { XCircle, LogOut } from 'lucide-react';

export default function RejectedPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleReturnToLogin = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 overflow-hidden selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full opacity-60" />
      </div>

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/60 backdrop-blur-2xl border border-slate-200 rounded-3xl p-10 shadow-2xl text-center border-t-slate-100">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-8 shadow-sm">
            <XCircle size={40} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-extrabold text-black mb-3 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
            Your registration has been <span className="text-red-600 font-bold">rejected by the administrator</span>. You do not have permission to access the Campus Nexus dashboard at this time.
          </p>

          <button
            onClick={handleReturnToLogin}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 py-4 px-6 text-sm font-bold text-black transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]"
          >
            <LogOut size={18} className="text-slate-400" />
            Return to Login
          </button>
        </div>

        <p className="text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          Security Policy Restriction
        </p>
      </div>
    </main>
  );
}
