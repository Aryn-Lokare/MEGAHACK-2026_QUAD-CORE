"use client";

import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const enrollments = [
  { name: 'Cherry Delight', id: '#KP267400', amount: '$90.50', credits: '350 pcs', dept: 'Dessert', status: 'Pending' },
  { name: 'Kiwi', id: '#TL651535', amount: '$12.00', credits: '650 kg', dept: 'Fruits', status: 'Active' },
  { name: 'Mango Magic', id: '#GB651535', amount: '$100.50', credits: '1200 pcs', dept: 'Ice Cream', status: 'Inactive' },
  { name: 'Joy Care', id: '#ER651535', amount: '$59.99', credits: '700 pcs', dept: 'Care', status: 'On Sale' },
  { name: 'Blueberry Bliss', id: '#SD487441', amount: '$150.90', credits: '100 lt', dept: 'Dessert', status: 'Bouncing' },
  { name: 'Watermelon', id: '#TL449003', amount: '$10.99', credits: '23 lt', dept: 'Juice', status: 'Pending' },
  { name: 'Trilogy', id: '#KP651535', amount: '$130.00', credits: '3000 pcs', dept: 'Oil', status: 'Active' },
];

const statusStyles = {
  Pending: 'bg-orange-50 text-orange-500',
  Active: 'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-rose-50 text-rose-500',
  'On Sale': 'bg-blue-50 text-blue-500',
  Bouncing: 'bg-purple-50 text-purple-500',
};

export function CourseEnrollmentTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 pb-4 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-black tracking-tight transition-all">Enrollment Details</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Showing</span>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-900 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
              10 <ChevronLeft size={10} className="rotate-270" />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all font-semibold text-xs">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Enrollment ID</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fee Paid</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Credits</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enrollments.map((item, i) => (
              <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/10 transition-all">
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-xs font-bold text-slate-400 tracking-wider transition-colors group-hover:text-slate-600">{item.id}</td>
                <td className="px-8 py-4 text-sm font-bold text-slate-700">$90.50</td>
                <td className="px-8 py-4 text-xs font-bold text-slate-400">350 pcs</td>
                <td className="px-8 py-4 text-xs font-bold text-slate-400">Dessert</td>
                <td className="px-8 py-4">
                  <span className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-sm",
                    statusStyles[item.status as keyof typeof statusStyles] || 'bg-slate-50 text-slate-500'
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-center text-slate-300">
                  <button className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all hover:text-slate-600">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 pt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, '...', 10, 11].map((p, i) => (
            <button 
              key={i}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-extrabold transition-all",
                p === 3 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
