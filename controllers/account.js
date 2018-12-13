/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';
import config from '../config';

export async function getAccountDetail(req, res) {
  const currentAccount = await services.accountService.getAccountById(req.session.sessionId, req.params.accountId);
  const listWallet = await services.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId, config.api.pageSize, 0);
  const listTransfer = await services.transferService.getTransfersBySRN(req.session.sessionId, `account:${req.params.accountId}`, config.api.pageSize, 0);
  const listTransaction = await services.transactionService.getTransactionsBySRN(req.session.sessionId, `account:${req.params.accountId}`, config.api.pageSize, 0);
  const listHistorySession = await services.accountService.getSessionHistory(req.session.sessionId, req.params.accountId, config.api.pageSize, 0);
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
  res.render('pages/account_detail', {
    currentAccount, listWallet, listTransfer, listTransaction, listHistorySession, friendlyNames,
  });
}

export async function getWalletsByAccountIdAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listWallet = {};
    try {
      listWallet = await services.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId, config.api.pageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/wallets', {
      listWallet,
    });
  }
}

export async function getSessionsByAccountIdAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listSession = {};
    try {
      listSession = await services.accountService.getSessionHistory(req.session.sessionId, req.params.accountId, config.api.pageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/sessions', {
      listSession,
    });
  }
}

export async function downloadTransfers(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * config.api.pageSize;
  const transferCsv = await services.transferService.getTransferCsvBySRN(req.session.sessionId, `account:${req.params.accountId}`, config.api.pageSize, offset);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.accountId}_transfers.csv`);
  res.type('text/csv');
  return res.send(transferCsv).end();
}

export async function downloadTransactions(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * config.api.pageSize;
  const transactionsCsv = await services.transactionService.getTransactionCsvBySRN(req.session.sessionId, `account:${req.params.accountId}`, config.api.pageSize, offset);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.accountId}_transactions.csv`);
  res.type('text/csv');
  return res.send(transactionsCsv).end();
}

export async function disableAccount(req, res) {
  const isSuccess = await services.accountService.disableAccount(req.session.sessionId, req.params.accountId);
  if (isSuccess) {
    req.session.messages = ['Disable account successfully!'];
  }
  res.redirect(`/account/${req.params.accountId}`);
}

export async function getAccountsAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listAccount = {};
    try {
      listAccount = await services.accountService.getAccounts(req.session.sessionId, config.api.pageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/accounts', {
      listAccount,
    });
  }
}

export async function searchAccountByKeyword(req, res) {
  const listAccount = await services.accountService.searchByKeyword(req.session.sessionId, req.query.q, config.api.pageSize, 0);
  res.render('pages/account_search', {
    listAccount,
    keyword: req.query.q,
  });
}

export async function searchAccountByKeywordAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listAccount = {};
    try {
      listAccount = await services.accountService.searchByKeyword(req.session.sessionId, req.query.q, config.api.pageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/accounts', {
      listAccount,
    });
  }
}
