import type { NextRequest } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth/request-user';
import { handleApiError, success } from '@/lib/utils/response';
import {
  createPizzaSchema,
  patchPizzaSchema,
  pizzaParamsSchema,
  searchPizzaSchema,
  updatePizzaSchema,
} from '@/lib/validators/pizza';
import { CreatePizzaUseCase } from '../../application/use-cases/create-pizza';
import { DeletePizzaUseCase } from '../../application/use-cases/delete-pizza';
import { ListPizzasUseCase } from '../../application/use-cases/list-pizzas';
import { PartialUpdatePizzaUseCase } from '../../application/use-cases/partial-update-pizza';
import { SearchPizzaByNameUseCase } from '../../application/use-cases/search-pizza-by-name';
import { UpdatePizzaUseCase } from '../../application/use-cases/update-pizza';
import { MemoryPizzaRepository } from '../repositories/memory-pizza-repository';

const pizzaRepository = new MemoryPizzaRepository();
const listPizzas = new ListPizzasUseCase(pizzaRepository);
const searchPizzaByName = new SearchPizzaByNameUseCase(pizzaRepository);
const createPizza = new CreatePizzaUseCase(pizzaRepository);
const updatePizza = new UpdatePizzaUseCase(pizzaRepository);
const partialUpdatePizza = new PartialUpdatePizzaUseCase(pizzaRepository);
const deletePizza = new DeletePizzaUseCase(pizzaRepository);

export const pizzaController = {
  async list() {
    try {
      return success(await listPizzas.execute());
    } catch (error) {
      return handleApiError(error);
    }
  },

  async search(request: NextRequest) {
    try {
      const query = searchPizzaSchema.parse({
        name: request.nextUrl.searchParams.get('name') ?? '',
      });
      return success(await searchPizzaByName.execute(query.name));
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(request: NextRequest) {
    try {
      const user = getAuthenticatedUser(request);
      const body = createPizzaSchema.parse(await request.json());
      return success(await createPizza.execute(body, user.userId), 201);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async update(request: NextRequest, pizzaId: string) {
    try {
      const user = getAuthenticatedUser(request);
      pizzaParamsSchema.parse({ pizzaId });
      const body = updatePizzaSchema.parse(await request.json());
      return success(await updatePizza.execute(pizzaId, body, user));
    } catch (error) {
      return handleApiError(error);
    }
  },

  async patch(request: NextRequest, pizzaId: string) {
    try {
      const user = getAuthenticatedUser(request);
      pizzaParamsSchema.parse({ pizzaId });
      const body = patchPizzaSchema.parse(await request.json());
      return success(await partialUpdatePizza.execute(pizzaId, body, user));
    } catch (error) {
      return handleApiError(error);
    }
  },

  async remove(request: NextRequest, pizzaId: string) {
    try {
      const user = getAuthenticatedUser(request);
      pizzaParamsSchema.parse({ pizzaId });
      await deletePizza.execute(pizzaId, user);
      return success({ message: 'Pizza deleted successfully' });
    } catch (error) {
      return handleApiError(error);
    }
  },
};
