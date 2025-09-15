export const orderStatus = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const prescriptionReviewStatus = {
  PENDING: 'pending',
  OK: 'ok',
  CANCELLED: 'cancelled',
} as const;

export type TOrderStatus = (typeof orderStatus)[keyof typeof orderStatus];

export type TPrescriptionReviewStatus =
  (typeof prescriptionReviewStatus)[keyof typeof prescriptionReviewStatus];
