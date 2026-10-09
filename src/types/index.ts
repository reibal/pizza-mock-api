export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface Pizza {
  id: string;
  name: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  price: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  token: string;
  userId: string;
  role: UserRole;
  expiresAt: number;
}

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}
