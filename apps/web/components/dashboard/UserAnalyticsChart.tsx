"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface UserAnalyticsChartProps {
  data: {
    students: number;
    faculty: number;
    admins: number;
  };
}

export function UserAnalyticsChart({ data }: UserAnalyticsChartProps) {
  const chartData = [
    { name: 'Students', value: data?.students || 0, color: '#0F62FE' },
    { name: 'Faculty', value: data?.faculty || 0, color: '#002D9C' },
    { name: 'Admins', value: data?.admins || 0, color: '#1E3A5F' },
  ];

  return (
    <div className="h-[300px] w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <h3 className="text-lg font-bold text-black mb-4 tracking-tight">User Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9', opacity: 0.8 }}
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#000000', fontWeight: 600 }}
          />
          <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
