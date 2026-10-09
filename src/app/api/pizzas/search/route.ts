import type { NextRequest } from 'next/server';

import { pizzaController } from '@/modules/pizzas/infrastructure/controllers/pizza.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return pizzaController.search(request);
}
