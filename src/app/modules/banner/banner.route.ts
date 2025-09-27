import { Router } from 'express';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BannerValidation } from './banner.validation';
import { BannerControllers } from './banner.controller';

const router = Router();

// createBanner
router.post(
  '/create-banner',
  auth(USER_ROLE.superAdmin),
  validateRequest(BannerValidation.createBannerValidation),
  BannerControllers.createBanner,
);

export const BannerRouter = router;
