import { Router } from 'express';
import {
  getQueuedTopupTransfers,
} from '../controllers/topupTransfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/topup/transfers/daily', verifySession, getQueuedTopupTransfers);

export default router;
