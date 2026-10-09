import type { UserEntity } from '../entities/user';

export interface UserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  existsByUsername(username: string): Promise<boolean>;
  save(user: UserEntity): Promise<UserEntity>;
}
