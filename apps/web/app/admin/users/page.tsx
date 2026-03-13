"use client";

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { UserCircle2, Mail, Users, Search, Filter, Shield, MoreHorizontal, Clock, ArrowUpDown } from 'lucide-react';
import { supabase } from '../../../src/context/AuthContext';
import { cn } from '../../../lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Accounts Management</h1>
            <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest opacity-80">Unified directory of all campus users</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F62FE] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search mail or name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 w-64 shadow-sm transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-xs uppercase tracking-wider">
              <Filter size={16} className="text-slate-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                      Full Name <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Email Address</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Designated Role</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Current Status</th>
                  <th className="px-8 py-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right px-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-4"><div className="h-10 bg-slate-100 rounded-lg w-48" /></td>
                      <td className="px-8 py-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                      <td className="px-8 py-4"><div className="h-6 bg-slate-100 rounded-full w-24" /></td>
                      <td className="px-8 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                      <td className="px-8 py-4 text-right"><div className="h-8 bg-slate-100 rounded-lg w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F62FE] flex items-center justify-center font-bold shadow-sm transition-all group-hover:bg-[#0F62FE]/10">
                            {user.name?.[0] || <UserCircle2 size={24} />}
                          </div>
                          <span className="text-sm font-bold text-black">{user.name || 'Undefined User'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Mail size={14} className="text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border",
                          user.role === 'ADMIN' ? "bg-red-50 text-red-600 border-red-100" :
                          user.role === 'FACULTY' ? "bg-purple-50 text-purple-600 border-purple-100" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                          user.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right px-10">
                        <button className="p-2 hover:bg-white hover:border-slate-200 border border-transparent rounded-lg transition-all text-slate-400 hover:text-black hover:shadow-sm">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center justify-center text-slate-300">
                <Users size={48} className="mb-4 opacity-50" />
                <p className="font-extrabold uppercase tracking-[0.2em] text-sm">No Results Found</p>
                <p className="text-xs mt-1 font-bold text-slate-400">Try adjusting your search filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
