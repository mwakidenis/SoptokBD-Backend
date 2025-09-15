import { z } from 'zod';

const createOrderSchema = z.object({
  body: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    products: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        quantity: z.number().int().min(1),
        price: z.number().nonnegative(),
        requiredPrescription: z.boolean(),
      }),
    ),
    prescription: z.string().optional(),
    shippingInfo: z.object({
      shippingAddress: z.string(),
      shippingCity: z.string(),
    }),
    shippingCost: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    prescriptionReviewStatus: z.enum(['pending', 'ok', 'cancelled']).optional(),
    orderStatus: z.enum(['pending', 'shipped', 'delivered', 'cancelled']),
    paymentStatus: z.boolean(),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    products: z
      .array(
        z.object({
          productId: z.string(),
          name: z.string(),
          quantity: z.number().int().min(1),
          price: z.number().nonnegative(),
          requiredPrescription: z.boolean(),
        }),
      )
      .optional(),
    prescription: z.string().optional().optional(),
    shippingInfo: z
      .object({
        shippingAddress: z.string(),
        shippingCity: z.string(),
      })
      .optional(),
    shippingCost: z.number().nonnegative().optional(),
    totalPrice: z.number().nonnegative().optional(),
    prescriptionReviewStatus: z.enum(['pending', 'ok', 'cancelled']).optional(),
    orderStatus: z
      .enum(['pending', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    paymentStatus: z.boolean().optional(),
  }),
});

export const OrderValidationSchema = { createOrderSchema, updateOrderSchema };
