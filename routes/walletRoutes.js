import { Router } from 'express';
import {
  getWalletDetail,
  updateWalletNote,
  downloadTransfers,
  downloadTransactions,
  searchWallet,
  updateStatus,
  updateVerification,
  updateVbaData,
  saveAuthorizeDoc,
  findIdDocByWallet,
  findCoiDocByWallet,
  updateIdDocByWallet,
  updateCoiDocByWallet,
  findMerchantsByWallet,
  updateFirstMerchantByWallet,
} from '../controllers/wallet';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/wallet/:walletId', verifySession, getWalletDetail);
router.post('/wallet/:walletId', verifySession, updateWalletNote);
router.post('/wallet/:walletId/transfers/download', verifySession, downloadTransfers);
router.post('/wallet/:walletId/transactions/download', verifySession, downloadTransactions);

// update
router.post('/wallet/:walletId/status', verifySession, updateStatus);
router.post('/wallet/:walletId/verification/update', verifySession, updateVerification);
router.post('/wallet/:walletId/vbaData/update', verifySession, updateVbaData);

// search
router.get('/wallets/search', verifySession, searchWallet);

// post
router.post('/wallet/:walletId/authorizeDoc', verifySession, saveAuthorizeDoc);
router.post('/wallet/idDoc/update', verifySession, updateIdDocByWallet);
router.post('/wallet/coiDoc/update', verifySession, updateCoiDocByWallet);
router.post('/wallet/merchant/update', verifySession, updateFirstMerchantByWallet);

// ajax
router.get('/wallet/:walletId/idDoc', verifySession, findIdDocByWallet);
router.get('/wallet/:walletId/coiDoc', verifySession, findCoiDocByWallet);
router.get('/wallet/:walletId/merchants', verifySession, findMerchantsByWallet);

export default router;
