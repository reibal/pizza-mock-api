import type { NextRequest } from 'next/server';

import { handleApiError, success } from '@/lib/utils/response';
import { loginSchema, registerSchema } from '@/lib/validators/auth';
import { LoginUseCase } from '../../application/use-cases/login';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { MemoryUserRepository } from '../repositories/memory-user-repository';

const userRepository = new MemoryUserRepository();
const loginUseCase = new LoginUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase(userRepository);

export const authController = {
  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const dto = loginSchema.parse(body);
      const result = await loginUseCase.execute(dto);
      return success(result, 200);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async register(request: NextRequest) {
    try {
      const body = await request.json();
      const dto = registerSchema.parse(body);
      const user = await registerUseCase.execute({
        username: dto.username,
        password: dto.password,
        role: dto.role,
      });
      return success(user, 201);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
