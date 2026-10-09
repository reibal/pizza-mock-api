import type { NextRequest } from 'next/server';

import { authController } from '@/modules/auth/infrastructure/controllers/auth.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return authController.login(request);
}
