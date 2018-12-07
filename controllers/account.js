import { getAccount } from '../middlewares';
import service from '../services';

export default async function getAccountDetail(req, res) {
  const currentAccount = await getAccount(req.session.sessionId, req.params.accountId);
  const wallets = await service.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId);
  res.render('pages/account_detail', { currentAccount, wallets });
}
