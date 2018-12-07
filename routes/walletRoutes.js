import { Router } from 'express';
import getWalletDetail from '../controllers/wallet';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/wallet/:walletId', verifySession, getWalletDetail);

export default router;
