import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the current path
  const path = req.nextUrl.pathname;

  // Check for Amplify auth tokens - both idToken and accessToken for reliability
  const idToken = req.cookies.get('amplify.idToken');
  const accessToken = req.cookies.get('amplify.accessToken');
  const isAuthenticated = !!(idToken && accessToken);

  // // If user is trying to access login while authenticated
  // if (isAuthenticated) {
  //   return NextResponse.redirect(new URL('/dashboard', req.url));
  // }

  // // If user is trying to access dashboard while not authenticated
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard']
};