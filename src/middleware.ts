import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Initialize the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  // 1. Check if the user is authenticated
  const isLoggedIn = !!req.auth;
  
  // 2. Define which routes require authentication
  const isProtectedRoute = 
    req.nextUrl.pathname.includes('/technician') ||
    req.nextUrl.pathname.includes('/admin') ||
    req.nextUrl.pathname.includes('/profile');

  // 3. If trying to access a protected route while logged out, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    // Preserve the locale in the redirect
    const locale = req.nextUrl.pathname.split('/')[1] || 'en';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 4. Otherwise, proceed normally with the i18n middleware
  return intlMiddleware(req);
});

// Configure the middleware to run on all paths except static assets and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};