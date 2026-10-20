import type { NextRequest } from 'next/server';

import { pizzaController } from '@/modules/pizzas/infrastructure/controllers/pizza.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ pizzaId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { pizzaId } = await context.params;
  return pizzaController.getById(pizzaId);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { pizzaId } = await context.params;
  return pizzaController.update(request, pizzaId);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { pizzaId } = await context.params;
  return pizzaController.patch(request, pizzaId);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { pizzaId } = await context.params;
  return pizzaController.remove(request, pizzaId);
}
