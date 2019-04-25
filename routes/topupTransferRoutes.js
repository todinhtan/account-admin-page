import { Router } from 'express';
import {
  getQueuedTopupTransfers,
  createTopupTransfer,
} from '../controllers/topupTransfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/topup/transfers/daily', verifySession, getQueuedTopupTransfers);
router.post('/topup/transfer/create', verifySession, createTopupTransfer);

export default router;
