import { memoryStore } from '@/lib/storage/memory-store';
import { UserEntity } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/user-repository';

export class MemoryUserRepository implements UserRepository {
  async findAll(): Promise<UserEntity[]> {
    return Array.from(memoryStore.users.values(), UserEntity.fromRecord);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const record = memoryStore.users.get(id);
    return record ? UserEntity.fromRecord(record) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const id = memoryStore.usernames.get(username.toLowerCase());
    if (!id) return null;

    const record = memoryStore.users.get(id);
    return record ? UserEntity.fromRecord(record) : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    return memoryStore.usernames.has(username.toLowerCase());
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const record = user.toRecord();
    memoryStore.users.set(record.id, record);
    memoryStore.usernames.set(record.username.toLowerCase(), record.id);
    return user;
  }
}
