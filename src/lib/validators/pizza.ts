import { z } from '@/lib/zod';

export const pizzaBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'name must not be empty')
      .max(80, 'name must be at most 80 characters'),
    ingredients: z
      .array(z.string().trim().min(1, 'ingredient must not be empty'))
      .min(1, 'ingredients must contain at least one item'),
    prepTime: z
      .number()
      .int('prepTime must be an integer')
      .nonnegative('prepTime must be zero or greater'),
    cookTime: z
      .number()
      .int('cookTime must be an integer')
      .nonnegative('cookTime must be zero or greater'),
    price: z.number().positive('price must be greater than zero'),
  })
  .strict();

export const createPizzaSchema = pizzaBodySchema;
export const updatePizzaSchema = pizzaBodySchema;

export const patchPizzaSchema = pizzaBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided',
  });

export const searchPizzaSchema = z
  .object({
    name: z.string().trim().min(1, 'name query parameter is required'),
  })
  .strict();

export const pizzaParamsSchema = z.object({
  pizzaId: z.string().min(1, 'pizzaId is required'),
});

export const pizzaResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
  totalTime: z.number(),
  price: z.number(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const pizzaListResponseSchema = z.array(pizzaResponseSchema);

export type PizzaBodyInput = z.infer<typeof pizzaBodySchema>;
export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;
export type UpdatePizzaInput = z.infer<typeof updatePizzaSchema>;
export type PatchPizzaInput = z.infer<typeof patchPizzaSchema>;
export type SearchPizzaInput = z.infer<typeof searchPizzaSchema>;
export type PizzaParams = z.infer<typeof pizzaParamsSchema>;
export type PizzaResponse = z.infer<typeof pizzaResponseSchema>;
