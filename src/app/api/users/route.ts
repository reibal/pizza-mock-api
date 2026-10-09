import type { NextRequest } from 'next/server';

import { userController } from '@/modules/auth/infrastructure/controllers/user.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return userController.list(request);
}
