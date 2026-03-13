"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CourseAnalyticsChartProps {
  data: Array<{
    name: string;
    count: number;
  }>;
}

const COLORS = ['#0F62FE', '#002D9C', '#122B4A', '#697077', '#393939'];

export function CourseAnalyticsChart({ data }: CourseAnalyticsChartProps) {
  // Fallback data if none provided
  const chartData = data?.length > 0 ? data : [
    { name: 'Computer Science', count: 40 },
    { name: 'Engineering', count: 30 },
    { name: 'Business', count: 20 },
    { name: 'Arts', count: 10 },
  ];

  return (
    <div className="h-[300px] w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <h3 className="text-lg font-bold text-black mb-4 tracking-tight">Courses by Dept</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#000000', fontWeight: 600 }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
