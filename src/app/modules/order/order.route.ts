import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidationSchema } from './order.validation';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';
import { OrderController } from './order.controller';

const router = Router();

router.post(
  '/create-order-prescription',
  auth(USER_ROLE.user),
  validateRequest(OrderValidationSchema.createOrderSchema),
  OrderController.createOrderWithPrescription,
);

router.post(
  '/create-order-payment',
  auth(USER_ROLE.user),
  validateRequest(OrderValidationSchema.createOrderSchema),
  OrderController.createOrderPaymentWithoutPrescription,
);

router.get('/', auth(USER_ROLE.admin), OrderController.getAllOrder);

router.get(
  '/:orderId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderController.getSpecificOrder,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidationSchema.updateOrderSchema),
  OrderController.updateOrder,
);

router.patch(
  '/prescription/:id',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidationSchema.updateOrderSchema),
  OrderController.updatePrescriptionReview,
);

router.get(
  '/user-order/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderController.getUserOrders,
);

export const OrderRouter = router;
