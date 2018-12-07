import { Router } from 'express';
import webRoutes from './webRoutes';
import accountRoutes from './accountRoutes';

const router = Router();

router.use('/', webRoutes);
router.use('/', accountRoutes);

export default router;
