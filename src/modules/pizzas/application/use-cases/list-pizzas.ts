import type { PizzaRepository } from '../../domain/repositories/pizza-repository';
import type { PizzaResponseDTO } from '../dto/pizza.dto';
import { toPizzaResponse } from '../mappers/pizza.mapper';

export class ListPizzasUseCase {
  constructor(private readonly pizzaRepository: PizzaRepository) {}

  async execute(): Promise<PizzaResponseDTO[]> {
    const pizzas = await this.pizzaRepository.findAll();
    return pizzas.map(toPizzaResponse);
  }
}
