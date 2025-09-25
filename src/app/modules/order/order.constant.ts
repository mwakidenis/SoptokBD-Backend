export const orderStatus = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type TOrderStatus = (typeof orderStatus)[keyof typeof orderStatus];
