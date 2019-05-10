import { Router } from 'express';
import {
  index,
  createWithdrawTransfer,
  bulkCreateWithdrawTransfers,
} from '../controllers/withdrawTransfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/withdraw/transfers/daily', verifySession, index);
router.post('/withdraw/transfer/create', verifySession, createWithdrawTransfer);

router.post('/withdraw/transfer/bulkCreate', verifySession, bulkCreateWithdrawTransfers);

export default router;
