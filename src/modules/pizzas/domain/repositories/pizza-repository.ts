import type { PizzaEntity } from '../entities/pizza';

export interface PizzaRepository {
  findAll(): Promise<PizzaEntity[]>;
  findById(id: string): Promise<PizzaEntity | null>;
  findByName(name: string): Promise<PizzaEntity | null>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
  save(pizza: PizzaEntity): Promise<PizzaEntity>;
  delete(id: string): Promise<boolean>;
}
