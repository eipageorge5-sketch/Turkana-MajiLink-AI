import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { routing } from '@/i18n/routing';
import { UserRoles } from './lib/constants';

// 1. Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/admin': [UserRoles.ADMIN],
  '/county': [UserRoles.COUNTY_OFFICIAL, UserRoles.ADMIN],
  '/ngo': [UserRoles.NGO_PARTNER, UserRoles.ADMIN], // <-- FIXED: Changed to NGO_PARTNER
  '/committee': [UserRoles.COMMITTEE_LEADER, UserRoles.COUNTY_OFFICIAL, UserRoles.ADMIN],
  '/technician': [UserRoles.TECHNICIAN, UserRoles.ADMIN],
  '/citizen': [UserRoles.CITIZEN, UserRoles.TECHNICIAN, UserRoles.COMMITTEE_LEADER, UserRoles.COUNTY_OFFICIAL, UserRoles.NGO_PARTNER, UserRoles.ADMIN], // <-- FIXED: Changed to NGO_PARTNER
};

// 2. Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

// 3. Wrap intlMiddleware inside the auth middleware
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Extract the route segment after the locale (e.g., /en/admin -> /admin)
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] || routing.defaultLocale;
  const routeSegment = segments.slice(1).join('/');

  // Check if the current route is protected
  let requiredRoles: string[] | undefined;
  for (const [path, roles] of Object.entries(protectedRoutes)) {
    if (routeSegment.startsWith(path.substring(1))) { // remove leading slash
      requiredRoles = roles;
      break;
    }
  }

  if (requiredRoles) {
    // Route is protected. Check if user is authenticated.
    if (!req.auth) {
      const loginUrl = new URL(`/${locale}/login`, nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated. Check if they have the required role.
    const userRole = req.auth.user?.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      // Unauthorized: Redirect to their specific dashboard
      const defaultDashboards: Record<string, string> = {
        ADMIN: '/admin',
        TECHNICIAN: '/technician',
        COUNTY_OFFICIAL: '/county',
        COMMITTEE_LEADER: '/committee',
        NGO_PARTNER: '/ngo', 
        CITIZEN: '/citizen',
      }; 
      
      const targetDashboard = defaultDashboards[userRole] || '/technician'; 
      const redirectPath = `/${locale}${targetDashboard}`;
      return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
    }
  }

  // If all checks pass (or route is public), proceed to next-intl middleware
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)']
};