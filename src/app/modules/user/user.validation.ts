import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(12, { message: 'Password must be at most 12 characters' }),
    role: z.enum(['user', 'admin', 'superAdmin']).default('user'),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim().optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' })
      .optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(12, { message: 'Password must be at most 12 characters' })
      .optional(),
    role: z.enum(['user', 'admin', 'superAdmin']).default('user').optional(),
  }),
});

const updateUserRoleValidation = z.object({
  body: z.object({
    role: z.enum(['user', 'admin', 'superAdmin'], {
      required_error: 'Role is required',
      invalid_type_error: 'Invalid role',
    }),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
};
