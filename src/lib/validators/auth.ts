import { z } from '@/lib/zod';

const usernameSchema = z
  .string({ message: 'username is required' })
  .trim()
  .min(3, 'username must be at least 3 characters')
  .max(40, 'username must be at most 40 characters');

const passwordSchema = z
  .string({ message: 'password is required' })
  .min(6, 'password must be at least 6 characters')
  .max(72, 'password must be at most 72 characters');

export const loginSchema = z
  .object({
    username: usernameSchema,
    password: z.string({ message: 'password is required' }).min(1, 'password is required'),
  })
  .strict();

export const registerSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string({ message: 'confirmPassword is required' }),
    role: z.enum(['user', 'admin']).default('user'),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwords do not match',
    path: ['confirmPassword'],
  });

export const userResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(['user', 'admin']),
  createdAt: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userResponseSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
