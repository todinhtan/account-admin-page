import { Router } from 'express';
import { getPaymentMethodDetail } from '../controllers/paymentMethod';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/payment-method/:methodId', verifySession, getPaymentMethodDetail);

export default router;
