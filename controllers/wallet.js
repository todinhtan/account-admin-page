/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';
import config from '../config';

export async function getWalletDetail(req, res) {
  const currentWallet = await services.walletService.getWalletById(req.session.sessionId, req.params.walletId);
  const listTransfer = await services.transferService.getTransfersBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, config.api.pageSize, 0);
  const listTransaction = await services.transactionService.getTransactionsBySRN(req.session.sessionId, `wallet:${req.params.accountId}`, config.api.pageSize, 0);
  let friendlyNames = {};
  // get friendly name of SRN
  for (const tr of listTransfer.items) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
  }
  for (const tr of listTransaction.items) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
  }
  res.render('pages/wallet_detail', {
    currentWallet, listTransfer, listTransaction, friendlyNames,
  });
}

export async function updateWalletNote(req, res) {
  const isSuccess = await services.walletService.updateNote(req.session.sessionId, req.params.walletId, req.body.notes);
  if (isSuccess) {
    req.session.messages = ['Updated wallet successfully!'];
  }
  res.redirect(`/wallet/${req.params.walletId}`);
}

export async function downloadTransfers(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * config.api.pageSize;
  const transferCsv = await services.transferService.getTransferCsvBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, config.api.pageSize, offset);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.walletId}_transfers.csv`);
  res.type('text/csv');
  return res.send(transferCsv).end();
}

export async function downloadTransactions(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * config.api.pageSize;
  const transactionsCsv = await services.transactionService.getTransactionCsvBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, config.api.pageSize, offset);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.walletId}_transactions.csv`);
  res.type('text/csv');
  return res.send(transactionsCsv).end();
}

export async function searchWallet(req, res) {
  const wallet = await services.walletService.searchWallet(req.session.sessionId, req.params.accountId, req.query.q, req.query.type);
  if (wallet !== null) res.redirect(`/wallet/${wallet.id}`);
  else {
    req.session.errors = ['No wallet found!'];
    res.redirect(`/account/${req.params.accountId}`);
  }
}

export async function updateStatus(req, res) {
  const isSuccess = await services.walletService.updateStatus(req.session.sessionId, req.params.walletId, req.body.status);
  if (isSuccess) {
    req.session.messages = ['Updated status successfully!'];
  }
  res.redirect(`/wallet/${req.params.walletId}`);
}
