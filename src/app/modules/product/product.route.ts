import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';

const router = Router();

// createProduct
router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.createProductValidation),
  ProductControllers.createProduct,
);

// getSingleProduct
router.get('/:id', ProductControllers.getSingleProduct);

// getAllProducts
router.get('/', ProductControllers.getAllProducts);

// updateProduct
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.updateProductValidation),
  ProductControllers.updateProduct,
);

// deleteProduct
router.delete('/:id', auth(USER_ROLE.admin), ProductControllers.deleteProduct);

export const ProductRouter = router;
