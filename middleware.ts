import {withAuth} from 'next-auth/middleware';
import {NextResponse} from 'next/server';
import type {CustomUser} from './types/next-auth';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const adminPages = ['/documentation', '/admin'];
    const userPages = ['/resources'];
    const roles = (req.nextauth.token?.user as CustomUser)?.roles?.map(
      (role) => role.name,
    );

    // check if url matches any of the admin pages and if user has the required role ('project_admin')
    if (
      adminPages.some((page) => req.url.includes(page)) &&
      !roles.includes('project_admin')
    ) {
      return Response.redirect(
        `${req.nextUrl.origin}/unauthorized?redirect=${encodeURIComponent(req.url)}`,
      );
    }

    if (
      userPages.some((page) => req.url.includes(page)) &&
      roles.includes('project_admin')
    ) {
      return Response.redirect(
        `${req.nextUrl.origin}/unauthorized?redirect=${encodeURIComponent(req.url)}`,
      );
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/sign-up',
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    `/((?!api|static|favicon.ico|auth|reset|sign-up|assets|phone-verified|email-verification|registration-complete|reset-password|create-password|terms-of-service|privacy-policy).*)`,
  ],
};
