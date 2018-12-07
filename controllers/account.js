/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';

export default async function getAccountDetail(req, res) {
  const currentAccount = await services.accountService.getAccountById(req.session.sessionId, req.params.accountId);
  const wallets = await services.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId);
  const transfers = await services.transferService.getTransfersByAccountId(req.session.sessionId, req.params.accountId);
  let friendlyNames = {};
  // get friendly name of SRN
  for (const tr of transfers) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
  }
  res.render('pages/account_detail', {
    currentAccount, wallets, transfers, friendlyNames,
  });
}
