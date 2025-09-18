import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { reviewValidations } from './review.validation';

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
