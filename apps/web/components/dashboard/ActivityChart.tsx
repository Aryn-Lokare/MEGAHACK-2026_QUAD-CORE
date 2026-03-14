"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Dot
} from 'recharts';

const data = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 55 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 40 },
  { name: 'Sun', value: 20 },
];

export function ActivityChart() {
  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black tracking-tight">Weekly Activity</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Engagement levels over 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <LineChart data={data}>
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
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#0F62FE" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#0F62FE', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#0F62FE', stroke: '#FFFFFF', strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
