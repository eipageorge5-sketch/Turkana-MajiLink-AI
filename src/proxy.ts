import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { routing } from '@/i18n/routing';
import { UserRoles } from './lib/constants';

// 1. Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/admin': [UserRoles.ADMIN],
  '/county': [UserRoles.COUNTY_OFFICIAL, UserRoles.ADMIN],
  '/ngo': [UserRoles.NGO_STAFF, UserRoles.ADMIN],
  '/committee': [UserRoles.COMMITTEE_LEADER, UserRoles.COUNTY_OFFICIAL, UserRoles.ADMIN],
  '/technician': [UserRoles.TECHNICIAN, UserRoles.ADMIN],
  '/citizen': [UserRoles.CITIZEN, UserRoles.TECHNICIAN, UserRoles.COMMITTEE_LEADER, UserRoles.COUNTY_OFFICIAL, UserRoles.NGO_STAFF, UserRoles.ADMIN],
};

// 2. Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

// 3. Wrap intlMiddleware inside the auth middleware
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Extract the route segment after the locale (e.g., /en/admin -> /admin)
  // The locale is always the first segment
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
      // Unauthorized: Redirect to their specific dashboard or a 403 page
      const defaultDashboards: Record<string, string> = {
        [UserRoles.ADMIN]: '/admin',
        [UserRoles.COUNTY_OFFICIAL]: '/county',
        [UserRoles.NGO_STAFF]: '/ngo',
        [UserRoles.COMMITTEE_LEADER]: '/committee',
        [UserRoles.TECHNICIAN]: '/technician',
        [UserRoles.CITIZEN]: '/citizen',
      };
      
            // DEMO SAFE FALLBACK: If we don't know their exact dashboard, 
      // always send them to the technician dashboard so they never see a 404.
      const targetDashboard = defaultDashboards[userRole] || '/technician'; 
      const redirectPath = `/${locale}${targetDashboard}`;
      return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
    }
  }

  // If all checks pass (or route is public), proceed to next-intl middleware
  return intlMiddleware(req);
});

export const config = {
  // Match all paths except static files, api routes (handled by NextAuth), and _next
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)']
};