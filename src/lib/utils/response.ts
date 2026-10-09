import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { ApiError } from '@/lib/errors/api-error';

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function failure(
  code: string,
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return failure('VALIDATION_ERROR', 'Validation failed', 400, error.issues);
  }

  if (error instanceof ApiError) {
    return failure(error.code, error.message, error.status, error.details);
  }

  if (error instanceof SyntaxError) {
    return failure('VALIDATION_ERROR', 'Request body is not valid JSON', 400);
  }

  console.error('[api] Unhandled error:', error);
  return failure('INTERNAL_ERROR', 'Internal server error', 500);
}
