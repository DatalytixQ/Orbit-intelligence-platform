import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path.startsWith('/api/');
  const token = request.cookies.get('datalytixq_token')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Admin protection
  if (path.startsWith('/admin') && token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('ascii');
      const payload = JSON.parse(decodedJson);
      if (!payload.is_admin) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    '/',
    '/sales/:path*',
    '/finance/:path*',
    '/inventory/:path*',
    '/insights/:path*',
    '/account/:path*',
    '/admin/:path*',
    '/login'
  ]
};
