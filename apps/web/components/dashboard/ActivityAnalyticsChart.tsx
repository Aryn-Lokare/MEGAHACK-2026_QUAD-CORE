"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ActivityAnalyticsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function ActivityAnalyticsChart({ data }: ActivityAnalyticsChartProps) {
  // Fallback data
  const chartData = data?.length > 0 ? data : [
    { date: '2026-03-07', count: 400 },
    { date: '2026-03-08', count: 300 },
    { date: '2026-03-09', count: 600 },
    { date: '2026-03-10', count: 800 },
    { date: '2026-03-11', count: 500 },
    { date: '2026-03-12', count: 900 },
    { date: '2026-03-13', count: 700 },
  ];

  return (
    <div className="h-[300px] w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <h3 className="text-lg font-bold text-black mb-4 tracking-tight">Daily Activity</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#0F62FE" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value) => value.split('-').slice(1).join('/')}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#000000', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#0F62FE" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
