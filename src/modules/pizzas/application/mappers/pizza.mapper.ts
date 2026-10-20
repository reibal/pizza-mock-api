import type { PizzaEntity } from '../../domain/entities/pizza';
import type { PizzaResponseDTO } from '../dto/pizza.dto';

export function toPizzaResponse(pizza: PizzaEntity): PizzaResponseDTO {
  return {
    id: pizza.id,
    name: pizza.name,
    ingredients: pizza.ingredients,
    prepTime: pizza.prepTime,
    cookTime: pizza.cookTime,
    totalTime: pizza.totalTime,
    price: pizza.price,
    ownerId: pizza.ownerId,
    createdAt: pizza.createdAt,
    updatedAt: pizza.updatedAt,
  };
}
