import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We run the proxy on matching protected routes
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isProtectedPath = pathname.startsWith('/items/add') || pathname.startsWith('/items/manage');

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if no token is present
      const loginUrl = new URL('/login', request.url);
      // Store the destination to redirect back after successful login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow proceeding
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/items/add/:path*',
    '/items/manage/:path*',
  ],
};
