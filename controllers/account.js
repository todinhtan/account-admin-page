/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import moment from 'moment';
import services from '../services';

export async function getAccountDetail(req, res) {
  const currentAccount = await services.accountService.getAccountById(req.session.sessionId, req.params.accountId);
  const listWallet = await services.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId, req.session.walletPageSize, 0);
  const listTransfer = await services.transferService.getTransfersBySRN(req.session.sessionId, `account:${req.params.accountId}`, req.session.transferPageSize, 0);
  const listTransaction = await services.transactionService.getTransactionsBySRN(req.session.sessionId, `account:${req.params.accountId}`, req.session.transactionPageSize, 0);
  const listHistorySession = await services.accountService.getSessionHistory(req.session.sessionId, req.params.accountId, req.session.sessionPageSize, 0);
  const listPaymentMethod = await services.paymentMethodService.getPaymentMethodsByAccount(req.session.sessionId, req.params.accountId, 100 /* get all methods in one call */, 0);
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
    currentAccount,
    listWallet,
    listTransfer,
    listTransaction,
    listHistorySession,
    friendlyNames,
    listPaymentMethod,
  });
}

export async function getWalletsByAccountIdAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * req.session.walletPageSize;
    let listWallet = {};
    try {
      listWallet = await services.walletService.getWalletsByAccountId(req.session.sessionId, req.params.accountId, req.session.walletPageSize, offset);
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
    const offset = (page - 1) * req.session.sessionPageSize;
    let listSession = {};
    try {
      listSession = await services.accountService.getSessionHistory(req.session.sessionId, req.params.accountId, req.session.sessionPageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/sessions', {
      listSession,
    });
  }
}

export async function downloadTransfers(req, res) {
  const from = moment(req.body.from, 'YYYY-MM-DD').format('x');
  const to = moment(req.body.to, 'YYYY-MM-DD').format('x');
  const transferCsv = await services.transferService.getTransferCsvBySRN(req.session.sessionId, `account:${req.params.accountId}`, req.body.limit, 0, from, to);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.accountId}_transfers.csv`);
  res.type('text/csv');
  return res.send(transferCsv).end();
}

export async function downloadTransactions(req, res) {
  const from = moment(req.body.from, 'YYYY-MM-DD').format('x');
  const to = moment(req.body.to, 'YYYY-MM-DD').format('x');
  const transactionsCsv = await services.transactionService.getTransactionCsvBySRN(req.session.sessionId, `account:${req.params.accountId}`, req.body.limit, 0, from, to);
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
    const offset = (page - 1) * req.session.accountPageSize;
    let listAccount = {};
    try {
      listAccount = await services.accountService.getAccounts(req.session.sessionId, req.session.accountPageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/accounts', {
      listAccount,
    });
  }
}

export async function searchAccountByKeyword(req, res) {
  const listAccount = await services.accountService.searchByKeyword(req.session.sessionId, req.query.q, req.session.accountPageSize, 0);
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
    const offset = (page - 1) * req.session.accountPageSize;
    let listAccount = {};
    try {
      listAccount = await services.accountService.searchByKeyword(req.session.sessionId, req.query.q, req.session.accountPageSize, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/accounts', {
      listAccount,
    });
  }
}

export async function updateStatus(req, res) {
  let isSuccess = false;
  switch (req.body.status) {
    case 'SUBMITTED_AND_PENDING_REVIEW':
      isSuccess = await services.accountService.markUnderReview(req.session.sessionId, req.params.accountId);
      break;
    case 'NEED_ATTENTION':
      isSuccess = await services.accountService.markNeedAttention(req.session.sessionId, req.params.accountId);
      break;
    case 'APPROVED':
      isSuccess = await services.accountService.markApproved(req.session.sessionId, req.params.accountId);
      break;
    case 'REJECTED':
      isSuccess = await services.accountService.markRejected(req.session.sessionId, req.params.accountId);
      break;
    case 'DISABLED':
      isSuccess = await services.accountService.disableAccount(req.session.sessionId, req.params.accountId);
      break;
    default:
      break;
  }
  if (isSuccess) {
    req.session.messages = ['Updated status successfully!'];
  }
  res.redirect(`/account/${req.params.accountId}`);
}

export async function verifyIdentity(req, res) {
  const isSuccess = await services.accountService.verifyIdentity(req.session.sessionId, req.params.accountId, req.params.identity);
  if (isSuccess) {
    req.session.messages = [`Verified identity ${req.params.identity} successfully!`];
  } else {
    req.session.errors = [`Verified identity ${req.params.identity} failed!`];
  }
  res.redirect(`/account/${req.params.accountId}`);
}

export async function removeIdentity(req, res) {
  const isSuccess = await services.accountService.removeIdentity(req.session.sessionId, req.params.accountId, req.params.identity);
  if (isSuccess) {
    req.session.messages = [`Removed identity ${req.params.identity} successfully!`];
  } else {
    req.session.errors = [`Removed identity ${req.params.identity} failed!`];
  }
  res.redirect(`/account/${req.params.accountId}`);
}

export async function sendResetPassword(req, res) {
  const isSuccess = await services.accountService.sendResetPassword(req.session.sessionId, req.body.identity);
  if (isSuccess) {
    req.session.messages = [`Send reset password token to ${req.body.identity} successfully!`];
  } else {
    req.session.errors = [`Send reset password token to ${req.body.identity} failed!`];
  }
  res.redirect(`/account/${req.params.accountId}`);
}
