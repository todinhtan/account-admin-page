/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import moment from 'moment';
import services from '../services';
import logger from '../utils/logger';

export async function getWalletDetail(req, res) {
  const currentWallet = await services.walletService.getWalletById(req.session.sessionId, req.params.walletId);
  const listTransfer = await services.transferService.getTransfersBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, req.session.transferPageSize, 0);
  const listTransaction = await services.transactionService.getTransactionsBySRN(req.session.sessionId, `wallet:${req.params.accountId}`, req.session.transactionPageSize, 0);
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

  const vba = await services.vbaService.getVbaByWallet(req.params.walletId);

  // get documents
  const document = {};
  // if (currentWallet.vbaVerificationData) {
  //   if (currentWallet.vbaVerificationData.idDoc) document.idDoc = await services.documentService.getDocumentUri(req.session.sessionId, currentWallet.vbaVerificationData.idDoc);
  //   if (currentWallet.vbaVerificationData.coiDoc) document.coiDoc = await services.documentService.getDocumentUri(req.session.sessionId, currentWallet.vbaVerificationData.coiDoc);
  // }
  if (vba) {
    if (vba.idDoc) document.idDoc = await services.documentService.getDocumentUri(req.session.sessionId, vba.idDoc);
    if (vba.coiDoc) document.coiDoc = await services.documentService.getDocumentUri(req.session.sessionId, vba.coiDoc);
  }

  // get beauty array of balance currencies
  const balances = [];
  let currencies = [];
  if (currentWallet.balances !== undefined && currentWallet.balances !== null) {
    currencies = currencies.concat(Object.keys(currentWallet.balances));
  }

  if (currentWallet.totalBalances !== undefined && currentWallet.totalBalances !== null) {
    currencies = currencies.concat(Object.keys(currentWallet.totalBalances));
  }

  if (currentWallet.availableBalances !== undefined && currentWallet.availableBalances !== null) {
    currencies = currencies.concat(Object.keys(currentWallet.availableBalances));
  }

  for (const key of new Set(currencies)) {
    balances.push({
      currency: key,
      balances: currentWallet.balances ? currentWallet.balances[key] : null,
      totalBalances: currentWallet.totalBalances ? currentWallet.totalBalances[key] : null,
      availableBalances: currentWallet.availableBalances ? currentWallet.availableBalances[key] : null,
    });
  }

  const authorizeDoc = await services.walletService.findAuthorizeDocByWallet(currentWallet.id);

  const synapseUser = await services.synapseUserService.getSynapseUserByWalletId(req.params.walletId);

  let isDeactivatedNode = false;
  let isLockedUser = false;
  if (synapseUser && synapseUser.userId) {
    isDeactivatedNode = await services.synapseUserService.checkIsDeactivatedNode(synapseUser.userId);
    isLockedUser = await services.synapseUserService.checkIsLockedUser(synapseUser.userId);
  }

  res.render('pages/wallet_detail', {
    currentWallet, listTransfer, listTransaction, friendlyNames, balances, document, authorizeDoc, vba, synapseUser, isDeactivatedNode, isLockedUser,
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
  const from = moment(req.body.from, 'YYYY-MM-DD').format('x');
  const to = moment(req.body.to, 'YYYY-MM-DD').format('x');
  const transferCsv = await services.transferService.getTransferCsvBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, req.body.limit, 0, from, to);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.walletId}_transfers.csv`);
  res.type('text/csv');
  return res.send(transferCsv).end();
}

export async function downloadTransactions(req, res) {
  const from = moment(req.body.from, 'YYYY-MM-DD').format('x');
  const to = moment(req.body.to, 'YYYY-MM-DD').format('x');
  const transactionsCsv = await services.transactionService.getTransactionCsvBySRN(req.session.sessionId, `wallet:${req.params.walletId}`, req.body.limit, 0, from, to);
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.walletId}_transactions.csv`);
  res.type('text/csv');
  return res.send(transactionsCsv).end();
}

export async function searchWallet(req, res) {
  const wallet = await services.walletService.searchWallet(req.session.sessionId, req.query.q, req.query.type);
  if (wallet !== null) res.redirect(`/wallet/${wallet.id}`);
  else {
    req.session.errors = [`No wallet with ${req.query.type} = ${req.query.q} found!`];
    res.redirect(req.header('Referer'));
  }
}

export async function updateStatus(req, res) {
  const isSuccess = await services.walletService.updateStatus(req.session.sessionId, req.params.walletId, req.body.status);
  if (isSuccess) {
    req.session.messages = ['Updated status successfully!'];
  }
  res.redirect(`/wallet/${req.params.walletId}`);
}


export async function bulkUpdateStatus(req, res) {
  const { walletIds, status } = req.body;
  const { sessionId } = req.session;

  try {
    if (walletIds && status && walletIds.reduce) {
      let totalAffected = 0;
      for (const walletId of walletIds) {
        const isSuccess = await services.walletService.updateStatus(sessionId, walletId, status);
        totalAffected += (isSuccess ? 1 : 0);
      }

      if (totalAffected > 0) req.session.messages = [`${totalAffected} wallet statuses has been updated to ${status}!`];
      else req.session.errors = ['No wallet status has been updated!'];
    }
  } catch (error) {
    logger.error(error);
  }

  res.redirect(req.header('Referer'));
}

export async function updateVerification(req, res) {
  req.body.countries = req.body.countries.split(',');
  // const isSuccess = await services.walletService.updateVerification(req.session.sessionId, req.params.walletId, req.body);
  const isSuccess = await services.walletService.updateVerificationToVbaService(req.params.walletId, req.body);
  if (isSuccess) {
    req.session.messages = ['Updated VBA verification successfully!'];
  }
  res.redirect(`/wallet/${req.params.walletId}`);
}

export async function updateVbaData(req, res) {
  const { walletId } = req.params;
  const { country } = req.body;
  let vbaData = null;
  try {
    vbaData = JSON.parse(req.body.vbaData);
  } catch (error) {
    // invalid VbaData
  }

  if (!vbaData) {
    req.session.errors = ['vbaData is not valid json!'];
  } else {
    const isSuccess = await services.walletService.updateVbaData(walletId, country, vbaData);
    if (isSuccess) {
      req.session.messages = ['Updated VBA data successfully!'];
    }
  }
  res.redirect(req.header('Referer'));
}

export async function saveAuthorizeDoc(req, res) {
  const { walletId } = req.params;
  const docData = req.body;

  const result = await services.walletService.saveAuthorizeDoc(walletId, docData, req.session.account ? req.session.account.id : '', req.session.account && req.session.account.profile ? req.session.account.profile.name : '');
  if (result) req.session.messages = ['Successfully'];
  else req.session.errors = ['Failed to save data'];
  res.redirect(req.header('Referer'));
}

export async function findIdDocByWallet(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let result = null;
    const { walletId } = req.params;
    try {
      result = await services.walletService.findIdDocByWallet(req.session.sessionId, walletId);
    } catch (error) {
      // let accounts empty
    }
    res.json(result);
  }
}

export async function findCoiDocByWallet(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let result = null;
    const { walletId } = req.params;
    try {
      result = await services.walletService.findCoiDocByWallet(req.session.sessionId, walletId);
    } catch (error) {
      // let accounts empty
    }
    res.json(result);
  }
}

export async function updateIdDocByWallet(req, res) {
  let result = null;
  const { walletId, idDoc } = req.body;
  try {
    result = await services.walletService.updateIdDocByWallet(req.session.sessionId, walletId, idDoc);
  } catch (error) {
    // let accounts empty
  }
  res.json(result);
}

export async function updateCoiDocByWallet(req, res) {
  let result = null;
  const { walletId, coiDoc } = req.body;
  try {
    result = await services.walletService.updateCoiDocByWallet(req.session.sessionId, walletId, coiDoc);
  } catch (error) {
    // let accounts empty
  }
  res.json(result);
}

export async function findMerchantsByWallet(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let result = null;
    const { walletId } = req.params;
    try {
      result = await services.walletService.findMerchantsByWallet(walletId);
    } catch (error) {
      // let accounts empty
    }
    res.json(result);
  }
}

export async function updateFirstMerchantByWallet(req, res) {
  let result = null;
  const { walletId, merchantId } = req.body;
  try {
    result = await services.walletService.updateFirstMerchantByWallet(walletId, merchantId);
  } catch (error) {
    // let accounts empty
  }
  res.send(result);
}
