import type { NextRequest } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth/request-user';
import { AuthorizationError } from '@/lib/errors/api-error';
import { handleApiError, success } from '@/lib/utils/response';
import { ListUsersUseCase } from '../../application/use-cases/list-users';
import { MemoryUserRepository } from '../repositories/memory-user-repository';

const userRepository = new MemoryUserRepository();
const listUsers = new ListUsersUseCase(userRepository);

export const userController = {
  async list(request: NextRequest) {
    try {
      const user = getAuthenticatedUser(request);
      if (user.role !== 'admin') {
        throw new AuthorizationError('Only admins can list users');
      }
      return success(await listUsers.execute());
    } catch (error) {
      return handleApiError(error);
    }
  },
};
