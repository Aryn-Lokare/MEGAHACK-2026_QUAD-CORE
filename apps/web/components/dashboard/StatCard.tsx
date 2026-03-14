import { LucideIcon } from 'lucide-react';
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
      "p-6 rounded-2xl bg-[#101827] border border-charcoal-blue-800 flex flex-col gap-4 shadow-xl hover:shadow-electric-sapphire-500/10 transition-all duration-300 group cursor-default",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">{title}</span>
        <div className="p-2.5 rounded-xl bg-charcoal-blue-800 text-charcoal-blue-400 group-hover:bg-electric-sapphire-500 group-hover:text-white transition-colors duration-300">
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className={cn(
            "text-[11px] font-bold px-2 py-1 rounded-lg",
            trend.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
