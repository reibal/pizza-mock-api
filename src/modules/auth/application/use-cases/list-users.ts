import type { UserRepository } from '../../domain/repositories/user-repository';
import type { PublicUserDTO } from '../dto/auth.dto';
import { toPublicUser } from '../mappers/user.mapper';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<PublicUserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(toPublicUser);
  }
}
