import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { reviewValidations } from './review.validation';
import { ReviewController } from './review.controller';

const router = Router();

router.post(
  '/create-review',
  // auth(USER_ROLE.user),
  validateRequest(reviewValidations.createReviewSchema),
  ReviewController.createReview,
);

router.get('/', ReviewController.getAllReviews);

router.get('/:id', ReviewController.getSpecificProductReviews);

router.get(
  '/user-product/:id',
  ReviewController.getSpecificUserAndProductReview,
);

export const ReviewRouter = router;
