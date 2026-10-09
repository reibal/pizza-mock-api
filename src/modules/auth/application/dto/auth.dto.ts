import type { UserRole } from '@/types';

export interface RegisterUserDTO {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface PublicUserDTO {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseDTO {
  token: string;
  user: PublicUserDTO;
}
