"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AssignmentCompletionChartProps {
  data?: Array<{ name: string; value: number; color?: string }>;
}

export function AssignmentCompletionChart({ data: propData }: AssignmentCompletionChartProps) {
  const chartData = (propData || [
    { name: 'On Time', value: 0, color: '#0F62FE' },
    { name: 'Late', value: 0, color: '#F59E0B' },
    { name: 'Missing', value: 0, color: '#EF4444' },
  ]).map(item => ({
    ...item,
    color: item.color || (item.name === 'On Time' ? '#0F62FE' : item.name === 'Late' ? '#F59E0B' : '#EF4444')
  }));

  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black tracking-tight">Assignment Status</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Completion Distribution</p>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} 
          />
          <Tooltip 
            cursor={{ fill: '#F8FAFC' }}
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
