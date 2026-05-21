import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/meetings', '/documents', '/template-studio'];
const AUTH_PATHS = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session');
  const hasSession = Boolean(session?.value);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.includes(pathname);

  // Protect dashboard-like routes: redirect to login if no session cookie
  if (isProtected && !hasSession) {
    console.log(`[Middleware] No session — redirecting ${pathname} to /login`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthPage && hasSession) {
    console.log(`[Middleware] Session present — redirecting ${pathname} to /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
