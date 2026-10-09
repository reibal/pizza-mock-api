import { ConflictError } from '@/lib/errors/api-error';
import { PizzaEntity } from '../../domain/entities/pizza';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import type { CreatePizzaDTO, PizzaResponseDTO } from '../dto/pizza.dto';
import { toPizzaResponse } from '../mappers/pizza.mapper';

export class CreatePizzaUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(dto: CreatePizzaDTO, ownerId: string): Promise<PizzaResponseDTO> {
    if (await this.pizzaRepository.existsByName(dto.name)) {
      throw new ConflictError('A pizza with that name already exists');
    }

    const now = new Date().toISOString();
    const pizza = PizzaEntity.create({
      id: crypto.randomUUID(),
      name: dto.name,
      ingredients: dto.ingredients,
      prepTime: dto.prepTime,
      cookTime: dto.cookTime,
      price: dto.price,
      ownerId,
      createdAt: now,
      updatedAt: now,
    });

    await this.pizzaRepository.save(pizza);

    return toPizzaResponse(pizza);
  }
}
