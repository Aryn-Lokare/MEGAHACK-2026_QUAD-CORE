"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CheckSquare, XCircle, Search, Filter, ShieldCheck, UserCircle2, Clock } from 'lucide-react';
import { supabase } from '../../../src/context/AuthContext';
import { cn } from '../../../lib/utils';

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session user:", session?.user?.email);
      if (!session) {
        console.warn("No active session found");
      }
      const res = await fetch('/api/admin/users/pending', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        cache: 'no-store'
      });
      console.log("Fetch pending users response status:", res.status);
      const text = await res.text();
      console.log("Raw response body:", text);

      if (res.ok) {
        try {
          const data = JSON.parse(text);
          console.log("Fetched pending users count:", data.length);
          setPendingUsers(data);
        } catch (e) {
          console.error("Failed to parse pending users JSON:", text);
        }
      } else {
        console.error(`Fetch pending users failed with status ${res.status}:`, text);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        }
      });
      
      if (res.ok) {
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        console.error(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Access Approvals</h1>
            <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Review pending registrations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
              <Filter size={16} className="text-slate-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Requested Role</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Applied On</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-4"><div className="h-10 bg-slate-100 rounded-lg w-48" /></td>
                      <td className="px-8 py-4"><div className="h-6 bg-slate-100 rounded-full w-24" /></td>
                      <td className="px-8 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                      <td className="px-8 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                      <td className="px-8 py-4 flex justify-end gap-2"><div className="h-8 bg-slate-100 rounded-lg w-20" /><div className="h-8 bg-slate-100 rounded-lg w-20" /></td>
                    </tr>
                  ))
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0F62FE]/10 text-[#0F62FE] flex items-center justify-center">
                            <UserCircle2 size={24} />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-black">{user.name || 'Unknown User'}</span>
                            <span className="block text-xs font-medium text-slate-500 mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border",
                          user.role === 'FACULTY' 
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Clock size={14} />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-extrabold uppercase tracking-widest">
                          Pending
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(user.id, 'reject')}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAction(user.id, 'approve')}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            <ShieldCheck size={14} />
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && pendingUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <CheckSquare size={48} className="mb-4 opacity-50" />
                        <p className="font-bold uppercase tracking-widest text-sm">All Caught Up</p>
                        <p className="text-xs mt-1 opacity-70">There are no pending registrations to approve.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
