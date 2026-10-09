import { memoryStore } from '@/lib/storage/memory-store';
import { PizzaEntity } from '../../domain/entities/pizza';
import type { PizzaRepository } from '../../domain/repositories/pizza-repository';

export class MemoryPizzaRepository implements PizzaRepository {
  async findAll(): Promise<PizzaEntity[]> {
    return Array.from(memoryStore.pizzas.values(), PizzaEntity.fromRecord);
  }

  async findById(id: string): Promise<PizzaEntity | null> {
    const record = memoryStore.pizzas.get(id);
    return record ? PizzaEntity.fromRecord(record) : null;
  }

  async findByName(name: string): Promise<PizzaEntity | null> {
    const target = name.toLowerCase();
    const record = Array.from(memoryStore.pizzas.values()).find(
      (pizza) => pizza.name.toLowerCase() === target,
    );
    return record ? PizzaEntity.fromRecord(record) : null;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const target = name.toLowerCase();
    return Array.from(memoryStore.pizzas.values()).some(
      (pizza) => pizza.id !== excludeId && pizza.name.toLowerCase() === target,
    );
  }

  async save(pizza: PizzaEntity): Promise<PizzaEntity> {
    memoryStore.pizzas.set(pizza.id, pizza.toRecord());
    return pizza;
  }

  async delete(id: string): Promise<boolean> {
    return memoryStore.pizzas.delete(id);
  }
}
