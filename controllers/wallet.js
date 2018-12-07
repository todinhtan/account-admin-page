/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';

export default async function getWalletDetail(req, res) {
  const currentWallet = await services.walletService.getWalletById(req.session.sessionId, req.params.walletId);
  const transfers = await services.transferService.getTransfersByWalletId(req.session.sessionId, req.params.walletId);
  let friendlyNames = {};
  // get friendly name of SRN
  for (const tr of transfers) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
  }
  res.render('pages/wallet_detail', { currentWallet, transfers, friendlyNames });
}
