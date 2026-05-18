import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // Protect all /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/meetings') ||
      request.nextUrl.pathname.startsWith('/documents') ||
      request.nextUrl.pathname.startsWith('/template-studio')) {
    
    if (!session?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (session?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/meetings/:path*',
    '/documents/:path*',
    '/template-studio/:path*',
    '/login',
    '/signup',
  ],
};
