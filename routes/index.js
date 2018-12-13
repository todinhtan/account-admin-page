import { Router } from 'express';
import webRoutes from './webRoutes';
import accountRoutes from './accountRoutes';
import walletRoutes from './walletRoutes';
import transferRoutes from './transferRoutes';
import transactionRoutes from './transactionRoutes';

const router = Router();

router.use('/', webRoutes);
router.use('/', accountRoutes);
router.use('/', walletRoutes);
router.use('/', transferRoutes);
router.use('/', transactionRoutes);

export default router;
