import { NextResponse } from 'next/server';
import supabase from './lib/supabaseClient';

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

  // Verify token and user role for role-based access control
  try {
    // Fetch user session from Supabase
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Fetch user role from your users table
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !userProfile) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userRole = userProfile.role;

    // Role-based route protection
    if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/student/:path*'],
};
