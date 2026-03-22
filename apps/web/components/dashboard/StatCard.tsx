import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden",
      className
    )}>
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F62FE]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#0F62FE]/10 transition-colors" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-[#0F62FE] group-hover:to-[#6366F1] group-hover:text-white transition-all duration-500 shadow-sm text-slate-500">
          <Icon size={24} className="stroke-[2.5px]" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border",
            trend.isUp 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-rose-50 text-rose-600 border-rose-100'
          )}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-8 relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tight transition-colors">{value}</h3>
      </div>
    </div>
  );
}
