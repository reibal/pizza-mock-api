import { compare, hash } from 'bcryptjs';

export const BCRYPT_ROUNDS = 10;

export function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, BCRYPT_ROUNDS);
}

export function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return compare(plainPassword, passwordHash);
}
