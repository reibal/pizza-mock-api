import { NotFoundError } from '@/lib/errors/api-error';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import type { PizzaResponseDTO } from '../dto/pizza.dto';
import { toPizzaResponse } from '../mappers/pizza.mapper';

export class SearchPizzaByNameUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(name: string): Promise<PizzaResponseDTO> {
    const pizza = await this.pizzaRepository.findByName(name);

    if (!pizza) {
      throw new NotFoundError(`No pizza found with name '${name}'`);
    }

    return toPizzaResponse(pizza);
  }
}
