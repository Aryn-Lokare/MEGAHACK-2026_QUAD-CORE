"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  UserCircle, 
  Briefcase, 
  CreditCard, 
  Settings, 
  HelpCircle,
  LogOut,
  CheckSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../src/context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: CheckSquare, label: 'Approvals', href: '/admin/approvals' },
  { icon: Briefcase, label: 'Courses', href: '/admin/courses' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0F62FE] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            C
          </div>
          <span className="text-xl font-extrabold text-black tracking-tighter uppercase">Campus Nexus</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname.startsWith('/admin/dashboard'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
                isActive 
                  ? "bg-[#0F62FE] text-white shadow-lg shadow-blue-500/30" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-black"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-black")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          Log out
        </button>
      </div>
    </aside>
  );
}
