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
} from '../controllers/account';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/account/:accountId', verifySession, getAccountDetail);
router.get('/account/:accountId/transfers/download', verifySession, downloadTransfers);
router.get('/account/:accountId/transactions/download', verifySession, downloadTransactions);
router.get('/account/:accountId/disable', verifySession, disableAccount);

// search
router.get('/accounts/search', verifySession, searchAccountByKeyword);
router.get('/accounts/search/ajax', verifySession, searchAccountByKeywordAjax);

// ajax
router.get('/accounts/ajax', verifySession, getAccountsAjax);
router.get('/account/:accountId/wallets/ajax', verifySession, getWalletsByAccountIdAjax);
router.get('/account/:accountId/sessions/ajax', verifySession, getSessionsByAccountIdAjax);

export default router;
