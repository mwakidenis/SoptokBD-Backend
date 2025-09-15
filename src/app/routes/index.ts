import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { ProductRouter } from '../modules/product/product.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
