import { ConflictError } from '@/lib/errors/api-error';
import type { AuthenticatedUser } from '@/types';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import type { PizzaResponseDTO, UpdatePizzaDTO } from '../dto/pizza.dto';
import { toPizzaResponse } from '../mappers/pizza.mapper';
import { assertCanModifyPizza, getPizzaOrFail } from '../policies/pizza-policy';

export class UpdatePizzaUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(
    pizzaId: string,
    dto: UpdatePizzaDTO,
    user: AuthenticatedUser,
  ): Promise<PizzaResponseDTO> {
    const pizza = await getPizzaOrFail(this.pizzaRepository, pizzaId);
    assertCanModifyPizza(pizza, user);

    if (await this.pizzaRepository.existsByName(dto.name, pizzaId)) {
      throw new ConflictError('A pizza with that name already exists');
    }

    const updated = pizza.withChanges(dto);
    await this.pizzaRepository.save(updated);

    return toPizzaResponse(updated);
  }
}
