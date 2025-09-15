import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { ProductRouter } from '../modules/product/product.route';
import { OrderRouter } from '../modules/order/order.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/product',
    route: ProductRouter,
  },
  {
    path: '/order',
    route: OrderRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
