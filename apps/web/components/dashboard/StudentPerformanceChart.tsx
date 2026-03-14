"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Week 1', average: 72 },
  { name: 'Week 2', average: 75 },
  { name: 'Week 3', average: 70 },
  { name: 'Week 4', average: 82 },
  { name: 'Week 5', average: 78 },
];

export function StudentPerformanceChart() {
  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black tracking-tight">Performance Trend</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Weekly Average Progress</p>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0F62FE" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            itemStyle={{ color: '#000000', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#0F62FE" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorAvg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
