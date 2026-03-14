"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  CheckSquare,
  BookOpen,
  BarChart3,
  Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../src/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'ADMIN') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Users, label: 'Users', href: '/admin/users' },
        { icon: CheckSquare, label: 'Approvals', href: '/admin/approvals' },
        { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
      ];
    }
    if (user?.role === 'FACULTY') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/faculty/dashboard' },
        { icon: BookOpen, label: 'Courses', href: '/faculty/courses' },
        { icon: Users, label: 'Students', href: '/faculty/students' },
        { icon: BarChart3, label: 'Analytics', href: '/faculty/analytics' },
        { icon: Calendar, label: 'Predictions', href: '/faculty/predictions' },
        { icon: Settings, label: 'Settings', href: '/faculty/settings' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-charcoal-blue-950 border-r border-charcoal-blue-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/faculty/dashboard'} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-electric-sapphire-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-electric-sapphire-500/20">
            C
          </div>
          <span className="text-xl font-extrabold text-white tracking-tighter uppercase">CampusAI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
                isActive 
                  ? "bg-electric-sapphire-500 text-white shadow-lg shadow-electric-sapphire-500/30" 
                  : "text-charcoal-blue-400 hover:bg-charcoal-blue-900 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-charcoal-blue-500 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-charcoal-blue-800">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-charcoal-blue-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut size={20} className="text-charcoal-blue-500 group-hover:text-red-500 transition-colors" />
          Log out
        </button>
      </div>
    </aside>
  );
}
