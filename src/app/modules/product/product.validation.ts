import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    type: z.enum([
      'Tablet',
      'Capsule',
      'Syrup',
      'Injection',
      'Cream',
      'Drops',
      'Food',
      'Skin',
      'Baby',
    ]),
    description: z.string().min(1, 'Description is required'),
    price: z.number().gt(0, 'Price must be greater than 0'),
    discount: z.number().min(0).max(100).default(0),
    imageUrl: z.array(z.string().url()).min(1),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    expireDate: z.string(),
    inStock: z.boolean().default(true),
    requiredPrescription: z.boolean(),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim().optional(),
    type: z
      .enum(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'])
      .optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().gt(0, 'Price must be greater than 0').optional(),
    discount: z.number().min(0).max(100).default(0).optional(),
    imageUrl: z.array(z.string().url()).min(1).optional(),
    manufacturer: z.string().min(1, 'Manufacturer is required').optional(),
    quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
    expireDate: z.string().min(1, 'Expiry date is required').optional(),
    inStock: z.boolean().default(true).optional(),
  }),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};
