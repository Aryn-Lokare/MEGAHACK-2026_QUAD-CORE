import { NextResponse } from 'next/server';
import fs from 'fs';

const logFile = "n:/ai-campus-management/apps/api/debug.log";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith('/api') || pathname.startsWith('/faculty') || pathname.startsWith('/admin')) {
    const msg = `[NEXT_MIDDLEWARE] ${req.method} ${pathname} | Auth: ${req.headers.get('authorization') ? 'Y' : 'N'} | Role: ${req.cookies.get('userRole')?.value || 'Missing'}`;
    
    // Non-blocking fetch to log relay
    fetch('http://localhost:5000/log-middleware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg })
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/faculty/:path*', '/admin/:path*'],
};
