import { hashPassword } from '@/lib/auth/password';
import { ConflictError } from '@/lib/errors/api-error';
import { UserEntity } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/user-repository';
import type { PublicUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import { toPublicUser } from '../mappers/user.mapper';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<PublicUserDTO> {
    if (await this.userRepository.existsByUsername(dto.username)) {
      throw new ConflictError('Username already exists');
    }

    const user = UserEntity.create({
      id: crypto.randomUUID(),
      username: dto.username,
      passwordHash: await hashPassword(dto.password),
      role: dto.role,
      createdAt: new Date().toISOString(),
    });

    await this.userRepository.save(user);

    return toPublicUser(user);
  }
}
