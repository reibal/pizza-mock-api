import { AuthorizationError, NotFoundError } from '@/lib/errors/api-error';
import type { AuthenticatedUser } from '@/types';
import type { PizzaEntity } from '../../domain/entities/pizza';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';

export async function getPizzaOrFail(
  repository: PizzaRepository,
  pizzaId: string,
): Promise<PizzaEntity> {
  const pizza = await repository.findById(pizzaId);
  if (!pizza) {
    throw new NotFoundError('Pizza not found');
  }
  return pizza;
}

export function assertCanModifyPizza(pizza: PizzaEntity, user: AuthenticatedUser): void {
  if (!pizza.canModify(user.userId, user.role)) {
    throw new AuthorizationError('You can only modify your own pizzas');
  }
}
