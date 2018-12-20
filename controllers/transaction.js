/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';
import config from '../config';

export async function getTransactionsBySRNAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listTransaction = {};
    let friendlyNames = {};
    try {
      listTransaction = await services.transactionService.getTransactionsBySRN(req.session.sessionId, req.params.srn, config.api.pageSize, offset);
      // get friendly name of SRN
      for (const tr of listTransaction.items) {
        friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
        friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
      }
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/transactions', {
      listTransaction, friendlyNames,
    });
  }
}

export async function getTransactionById(req, res) {
  const transaction = await services.transactionService.getTransactionById(req.session.sessionId, req.query.tid);
  let friendlyNames = {};
  if (transaction != null) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(transaction.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(transaction.dest, friendlyNames, req.session.sessionId);
  }
  res.render('pages/transaction_search', {
    transaction,
    friendlyNames,
    tid: req.query.tid,
  });
}
