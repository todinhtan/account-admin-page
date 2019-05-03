import { Router } from 'express';
import {
  getQueuedTopupTransfers,
  createTopupTransfer,
  updateTopupTransfer,
  bulkCreateTransfers,
  bulkMarkRemovedTransfers,
} from '../controllers/topupTransfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/topup/transfers/daily', verifySession, getQueuedTopupTransfers);
router.post('/topup/transfer/create', verifySession, createTopupTransfer);
router.post('/topup/transfer/update', verifySession, updateTopupTransfer);

// bulk create
router.post('/topup/transfer/bulkCreate', verifySession, bulkCreateTransfers);
router.post('/topup/transfer/bulkRemove', verifySession, bulkMarkRemovedTransfers);

export default router;
