import { Router } from 'express';
import {
  getWalletDetail,
  updateWalletNote,
  downloadTransfers,
  downloadTransactions,
  searchWallet,
  updateStatus,
} from '../controllers/wallet';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/wallet/:walletId', verifySession, getWalletDetail);
router.post('/wallet/:walletId', verifySession, updateWalletNote);
router.get('/wallet/:walletId/transfers/download', verifySession, downloadTransfers);
router.get('/wallet/:walletId/transactions/download', verifySession, downloadTransactions);

// update
router.post('/wallet/:walletId/status', verifySession, updateStatus);

// search
router.get('/wallets/search', verifySession, searchWallet);

export default router;
