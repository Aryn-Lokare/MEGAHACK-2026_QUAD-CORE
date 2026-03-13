import { User, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const activities = [
  { id: 1, type: 'user', content: 'New student enrolled: Jane Doe', time: '2 mins ago', icon: User, color: 'text-blue-400' },
  { id: 2, type: 'course', content: 'New course added: Advanced AI', time: '1 hour ago', icon: BookOpen, color: 'text-purple-400' },
  { id: 3, type: 'assignment', content: 'Assignment submitted by John Smith', time: '3 hours ago', icon: CheckCircle, color: 'text-green-400' },
  { id: 4, type: 'attendance', content: 'Attendance marked for CS102', time: '5 hours ago', icon: Clock, color: 'text-yellow-400' },
  { id: 5, type: 'user', content: 'Faculty member assigned to CS102', time: '8 hours ago', icon: User, color: 'text-blue-400' },
];

export function ActivityFeed() {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 h-full">
      <h3 className="text-lg font-bold text-black mb-6 tracking-tight">Recent Activity</h3>
      <div className="flex flex-col gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 group">
            <div className={cn("p-2 rounded-xl bg-slate-100 transition-colors group-hover:bg-[#0F62FE] group-hover:text-white", activity.color)}>
              <activity.icon size={18} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-black font-medium">{activity.content}</p>
              <span className="text-xs text-slate-500 mt-1 font-semibold">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
