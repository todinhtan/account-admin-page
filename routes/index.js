import { Router } from 'express';
import webRoutes from './webRoutes';
import accountRoutes from './accountRoutes';
import walletRoutes from './walletRoutes';

const router = Router();

router.use('/', webRoutes);
router.use('/', accountRoutes);
router.use('/', walletRoutes);

export default router;
