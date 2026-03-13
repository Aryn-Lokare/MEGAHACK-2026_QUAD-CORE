"use client";

import { AdminLayout } from './AdminLayout';

export default function BlankPage({ title }: { title: string }) {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-300 tracking-tight uppercase mb-2">{title}</h1>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase opacity-50">Coming Soon</p>
        </div>
      </div>
    </AdminLayout>
  );
}
