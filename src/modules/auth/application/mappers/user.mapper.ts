import type { UserEntity } from '../../domain/entities/user';
import type { PublicUserDTO } from '../dto/auth.dto';

export function toPublicUser(user: UserEntity): PublicUserDTO {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}
