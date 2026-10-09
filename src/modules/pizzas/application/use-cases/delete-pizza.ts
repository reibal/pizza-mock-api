import type { AuthenticatedUser } from '@/types';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import { assertCanModifyPizza, getPizzaOrFail } from '../policies/pizza-policy';

export class DeletePizzaUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(pizzaId: string, user: AuthenticatedUser): Promise<void> {
    const pizza = await getPizzaOrFail(this.pizzaRepository, pizzaId);
    assertCanModifyPizza(pizza, user);
    await this.pizzaRepository.delete(pizzaId);
  }
}
