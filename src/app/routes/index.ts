import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRouter } from '../modules/auth/auth.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
