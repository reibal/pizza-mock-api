import type { NextRequest } from 'next/server';

import { AuthenticationError } from '@/lib/errors/api-error';
import type { AuthenticatedUser } from '@/types';

export const USER_ID_HEADER = 'x-user-id';
export const USER_ROLE_HEADER = 'x-user-role';

export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser {
  const userId = request.headers.get(USER_ID_HEADER);
  const role = request.headers.get(USER_ROLE_HEADER);

  if (!userId || (role !== 'user' && role !== 'admin')) {
    throw new AuthenticationError();
  }

  return { userId, role };
}
