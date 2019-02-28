import { Router } from 'express';
import {
  getAccountDetail,
  downloadTransfers,
  downloadTransactions,
  disableAccount,
  getAccountsAjax,
  getWalletsByAccountIdAjax,
  getSessionsByAccountIdAjax,
  searchAccountByKeyword,
  searchAccountByKeywordAjax,
  updateStatus,
  verifyIdentity,
  removeIdentity,
  sendResetPassword,
} from '../controllers/account';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/account/:accountId', verifySession, getAccountDetail);
router.post('/account/:accountId/transfers/download', verifySession, downloadTransfers);
router.post('/account/:accountId/transactions/download', verifySession, downloadTransactions);
router.get('/account/:accountId/disable', verifySession, disableAccount);
router.get('/account/:accountId/verifyIdentity/:identity', verifySession, verifyIdentity);
router.get('/account/:accountId/removeIdentity/:identity', verifySession, removeIdentity);
router.post('/account/:accountId/sendResetPassword', verifySession, sendResetPassword);

// search
router.get('/accounts/search', verifySession, searchAccountByKeyword);
router.get('/accounts/search/ajax', verifySession, searchAccountByKeywordAjax);

// update
router.post('/account/:accountId/status', verifySession, updateStatus);

// ajax
router.get('/accounts/ajax', verifySession, getAccountsAjax);
router.get('/account/:accountId/wallets/ajax', verifySession, getWalletsByAccountIdAjax);
router.get('/account/:accountId/sessions/ajax', verifySession, getSessionsByAccountIdAjax);

export default router;
