import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().gt(0, 'Price must be greater than 0'),
    discount: z.number().min(0).max(100).default(0),
    imageUrl: z.array(z.string().url()).min(1),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    inStock: z.boolean().default(true),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim().optional(),
    category: z.string().min(1, 'Category is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().gt(0, 'Price must be greater than 0').optional(),
    discount: z.number().min(0).max(100).default(0).optional(),
    imageUrl: z.array(z.string().url()).min(1).optional(),
    manufacturer: z.string().min(1, 'Manufacturer is required').optional(),
    quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
    inStock: z.boolean().default(true).optional(),
  }),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};
