import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';

const router = Router();

router.post('/:id', auth(USER_ROLE.user), PaymentController.makePayment);

export const PaymentRouter = router;
