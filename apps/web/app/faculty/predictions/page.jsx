"use client";

import { Sidebar } from '../../../components/layout/Sidebar';
import { StudentPredictionTable } from '../../../components/dashboard/StudentPredictionTable';
import { BrainCircuit, Info, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacultyPredictions() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'FACULTY')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch('/api/faculty/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      }
    }
    fetchPredictions();
  }, []);

  const handleRunAnalysis = async () => {
    setIsSyncing(true);
    // Simulate re-running AI analysis
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-inter font-bold uppercase tracking-widest text-xs">Initializing AI Models...</div>;
  if (!user || user.role !== 'FACULTY') return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64 overflow-hidden">
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-center bg-transparent border-b border-slate-200 pb-6 -mx-8 px-8 -mt-8 pt-8 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-electric-sapphire-500" size={24} />
                <h1 className="text-3xl font-extrabold text-black tracking-tight">AI Predictions</h1>
              </div>
              <p className="text-slate-500 font-medium">Predictive modeling for student performance and risk assessment</p>
            </div>
            <button 
              onClick={handleRunAnalysis}
              disabled={isSyncing}
              className="px-6 py-3.5 bg-electric-sapphire-500 text-white font-bold rounded-2xl shadow-lg shadow-electric-sapphire-500/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Recalculating...' : 'Refresh AI Analysis'}
            </button>
          </header>

          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
              <div className="lg:col-span-2">
                 <StudentPredictionTable students={students} />
              </div>
              
              <div className="space-y-10">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-electric-sapphire-500/10 transition-colors">
                      <BrainCircuit size={100} />
                   </div>
                   <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-black">
                      <Info size={20} className="text-electric-sapphire-500" />
                      How it works
                   </h3>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 relative z-10">
                      Our CampusAI engine processes historical submission data, attendance patterns, and engagement metrics to generate real-time risk assessments.
                   </p>
                   <ul className="space-y-4 relative z-10">
                      {['Llama 3.1 Inference', 'Grade Trend Analysis', 'Completion Modeling'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                           <div className="w-2 h-2 rounded-full bg-electric-sapphire-500" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                   <h3 className="text-lg font-bold mb-6 text-black tracking-tight">Global Risk Distribution</h3>
                   <div className="space-y-6">
                      {[
                        { label: 'High Risk', count: 3, color: 'bg-rose-500' },
                        { label: 'Medium Risk', count: 8, color: 'bg-amber-500' },
                        { label: 'Low Risk', count: 42, color: 'bg-emerald-500' }
                      ].map(risk => (
                        <div key={risk.label} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">{risk.label}</span>
                              <span className="text-slate-900">{risk.count} Students</span>
                           </div>
                           <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${risk.color} rounded-full`} 
                                style={{ width: `${(risk.count / 53) * 100}%` }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
