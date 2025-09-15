import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';

import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),p
  validateRequest(ProductValidation.createProductValidation),
  ProductControllers.createProduct,
);

router.get('/:id', ProductControllers.getSingleProduct);

router.get('/', ProductControllers.getAllProducts);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.updateProductValidation),
  ProductControllers.updateProduct,
);

router.delete('/:id', auth(USER_ROLE.admin), ProductControllers.deleteProduct);

export const ProductRouter = router;
