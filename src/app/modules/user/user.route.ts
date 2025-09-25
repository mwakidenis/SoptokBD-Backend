import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';

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

// getAllUsers
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getAllUsers,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserControllers.getSingleUser,
);

// router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);
router.delete('/:id', auth(USER_ROLE.superAdmin), UserControllers.deleteUser);

// update user role by superAdmin
router.patch(
  '/update-role/:id',
  auth(USER_ROLE.superAdmin), // only superAdmin can update roles
  validateRequest(UserValidation.updateUserRoleValidation),
  UserControllers.updateUserRole,
);

export const UserRouter = router;
