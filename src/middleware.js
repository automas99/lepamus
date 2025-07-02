import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { cookies } = req;
  const token = cookies['sb-access-token'];

  if (!token) {
    // Redirect to login if not authenticated and trying to access protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // Optionally, verify token and user role here for role-based access control

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
