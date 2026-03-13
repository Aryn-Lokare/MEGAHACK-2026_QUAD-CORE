'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIStickyButton() {
  const pathname = usePathname();

  // Define corridors or namespaces where the button should NOT appear
  const hideOnPaths = ['/', '/signup', '/pending', '/rejected', '/AICampusAssistant'];
  
  // Also hide if inside the AI Assistant itself (though covered by /AICampusAssistant)
  if (hideOnPaths.includes(pathname) || pathname.startsWith('/AICampusAssistant')) {
    return null;
  }

  return (
    <Link
      href="/AICampusAssistant"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="relative">
        {/* Pulsing background effect */}
        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
        
        {/* Main Button */}
        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-2xl group-hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M12 7v6" />
            <path d="M9 10h6" />
          </svg>
          
          {/* Badge/Label that appears on hover */}
          <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
            AI Assistant
          </div>
        </div>
      </div>
    </Link>
  );
}
