import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect /cart and /wishlist
  if (
    (request.nextUrl.pathname.startsWith('/cart') ||
     request.nextUrl.pathname.startsWith('/wishlist')) &&
    !token
  ) {
    // Redirect to login with redirect param
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/cart', '/wishlist'],
};