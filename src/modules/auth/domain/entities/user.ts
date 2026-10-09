import type { User as UserRecord, UserRole } from '@/types';

export interface UserProps {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export class UserEntity {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  static fromRecord(record: UserRecord): UserEntity {
    return new UserEntity({ ...record });
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  isAdmin(): boolean {
    return this.props.role === 'admin';
  }

  toRecord(): UserRecord {
    return { ...this.props };
  }
}
