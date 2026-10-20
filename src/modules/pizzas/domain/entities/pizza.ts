import type { Pizza as PizzaRecord, UserRole } from '@/types';

export interface PizzaProps {
  id: string;
  name: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  price: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type PizzaChanges = Partial<
  Pick<PizzaProps, 'name' | 'ingredients' | 'prepTime' | 'cookTime' | 'price'>
>;

export class PizzaEntity {
  private constructor(private readonly props: PizzaProps) {}

  static create(props: PizzaProps): PizzaEntity {
    return new PizzaEntity(props);
  }

  static fromRecord(record: PizzaRecord): PizzaEntity {
    return new PizzaEntity({ ...record });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get ingredients(): string[] {
    return this.props.ingredients;
  }

  get prepTime(): number {
    return this.props.prepTime;
  }

  get cookTime(): number {
    return this.props.cookTime;
  }

  get totalTime(): number {
    return this.props.prepTime + this.props.cookTime + 1;
  }

  get price(): number {
    return this.props.price;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  canModify(userId: string, role: UserRole): boolean {
    return role === 'admin' || this.props.ownerId === userId;
  }

  withChanges(changes: PizzaChanges): PizzaEntity {
    return new PizzaEntity({
      ...this.props,
      ...changes,
      updatedAt: new Date().toISOString(),
    });
  }

  toRecord(): PizzaRecord {
    return { ...this.props };
  }
}
