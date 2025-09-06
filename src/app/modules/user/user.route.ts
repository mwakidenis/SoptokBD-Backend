import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserValidation),
  UserControllers.createUser,
);

router.patch(
  '/update-user/:id',
  auth(USER_ROLE.user),
  validateRequest(UserValidation.updateUserValidation),
  UserControllers.updateUser,
);

router.patch(
  '/update-password/:id',
  auth(USER_ROLE.user),
  validateRequest(UserValidation.updateUserValidation),
  UserControllers.updatePassword,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getSingleUser,
);

router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);

export const UserRouter = router;
