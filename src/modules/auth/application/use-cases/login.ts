import { verifyPassword } from '@/lib/auth/password';
import { sessionStore } from '@/lib/auth/session-store';
import { signToken, TOKEN_TTL_SECONDS } from '@/lib/auth/tokens';
import { AuthenticationError } from '@/lib/errors/api-error';
import type { UserRepository } from '../../domain/repositories/user-repository';
import type { AuthResponseDTO, LoginDTO } from '../dto/auth.dto';
import { toPublicUser } from '../mappers/user.mapper';

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByUsername(dto.username);

    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new AuthenticationError('Invalid username or password');
    }

    const token = await signToken({ userId: user.id, role: user.role });

    sessionStore.create({
      token,
      userId: user.id,
      role: user.role,
      expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000,
    });

    return { token, user: toPublicUser(user) };
  }
}
