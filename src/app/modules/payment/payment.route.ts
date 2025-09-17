import { Router } from 'express';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/:id', auth(USER_ROLE.user), PaymentController.makePayment);

export const PaymentRouter = router;
