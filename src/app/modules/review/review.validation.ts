import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    userId: z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
      message: 'Invalid MongoDB ObjectId for userId',
    }),
    productId: z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
      message: 'Invalid MongoDB ObjectId for productId',
    }),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
  }),
});

export const reviewValidations = { createReviewSchema };
