import { z } from 'zod';

const createBannerValidation = z.object({
  body: z.object({
    heading: z.string().min(1, 'Description is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.array(z.string().url()).min(1),
  }),
});

const updateBannerValidation = z.object({
  body: z.object({
    heading: z.string().min(1, 'Description is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.array(z.string().url()).min(1),
  }),
});

export const BannerValidation = {
  createBannerValidation,
  updateBannerValidation,
};
