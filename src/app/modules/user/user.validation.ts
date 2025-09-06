import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z.string().min(6).max(12),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim().optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' })
      .optional(),
    password: z.string().min(6).max(12).optional(),
    role: z.enum(['user', 'admin']).default('user').optional(),
  }),
});

export const UserValidation = { createUserValidation, updateUserValidation };
