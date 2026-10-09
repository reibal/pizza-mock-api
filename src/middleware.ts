import { NextResponse, type NextRequest } from 'next/server';

import { USER_ID_HEADER, USER_ROLE_HEADER } from '@/lib/auth/request-user';
import { verifyToken } from '@/lib/auth/tokens';

function unauthorized(message: string): NextResponse {
  return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 401 });
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { method } = request;

  if (method === 'OPTIONS') {
    return NextResponse.next();
  }

  const isPublicRead = method === 'GET' && request.nextUrl.pathname.startsWith('/api/pizzas');

  if (isPublicRead) {
    return NextResponse.next();
  }

  const [scheme, token] = (request.headers.get('authorization') ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return unauthorized('Missing or malformed Authorization header');
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return unauthorized('Invalid or expired token');
  }

  const headers = new Headers(request.headers);
  headers.set(USER_ID_HEADER, payload.userId);
  headers.set(USER_ROLE_HEADER, payload.role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/api/pizzas/:path*', '/api/users/:path*'],
};
