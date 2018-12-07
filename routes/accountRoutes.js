import { Router } from 'express';
import getAccountDetail from '../controllers/account';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/account/:accountId', verifySession, getAccountDetail);

export default router;
