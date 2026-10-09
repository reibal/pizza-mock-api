import { pizzaController } from '@/modules/pizzas/infrastructure/controllers/pizza.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return pizzaController.list();
}
