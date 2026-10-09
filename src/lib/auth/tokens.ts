import { SignJWT, jwtVerify } from 'jose';

import type { UserRole } from '@/types';

const DEFAULT_DEV_SECRET = 'dev-only-insecure-jwt-secret';
const ALGORITHM = 'HS256';

export const TOKEN_TTL_SECONDS = 12 * 60 * 60;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return new TextEncoder().encode(DEFAULT_DEV_SECRET);
  }

  return new TextEncoder().encode(secret);
}

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (typeof payload.sub !== 'string' || (payload.role !== 'user' && payload.role !== 'admin')) {
      return null;
    }

    return { userId: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
