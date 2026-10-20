import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import type { PizzaResponseDTO } from '../dto/pizza.dto';
import { toPizzaResponse } from '../mappers/pizza.mapper';
import { getPizzaOrFail } from '../policies/pizza-policy';

export class GetPizzaByIdUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(pizzaId: string): Promise<PizzaResponseDTO> {
    const pizza = await getPizzaOrFail(this.pizzaRepository, pizzaId);
    return toPizzaResponse(pizza);
  }
}
