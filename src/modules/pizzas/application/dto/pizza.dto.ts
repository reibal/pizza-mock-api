export interface CreatePizzaDTO {
  name: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  price: number;
}

export type UpdatePizzaDTO = CreatePizzaDTO;

export interface PatchPizzaDTO {
  name?: string;
  ingredients?: string[];
  prepTime?: number;
  cookTime?: number;
  price?: number;
}

export interface PizzaResponseDTO {
  id: string;
  name: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  price: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
