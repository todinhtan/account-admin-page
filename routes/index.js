import { Router } from 'express';
import webRoutes from './webRoutes';
import accountRoutes from './accountRoutes';
import walletRoutes from './walletRoutes';
import transferRoutes from './transferRoutes';
import transactionRoutes from './transactionRoutes';
import paymentMethodRoutes from './paymentMethodRoutes';
import vbaRoutes from './vbaRoutes';

const router = Router();

router.use('/', webRoutes);
router.use('/', accountRoutes);
router.use('/', walletRoutes);
router.use('/', transferRoutes);
router.use('/', transactionRoutes);
router.use('/', paymentMethodRoutes);
router.use('/', vbaRoutes);

export default router;
