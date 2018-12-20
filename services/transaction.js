/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import json2csv from 'json2csv';

import config from '../config';

async function getTransactionsBySRN(sessionId, srn, limit, offset) {
  const result = {
    items: [],
    total: 0,
    size: config.api.pageSize,
  };
  let l = parseInt(limit, 10);
  let o = parseInt(offset, 10);
  if (isNaN(l) || l < 1) l = config.api.pageSize;
  if (isNaN(o) || o < 1) o = 0;

  result.size = l;
  try {
    const allTransactionsResp = await axios.get(`${config.api.prefix}/transactions/${srn}?sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allTransactionsResp && allTransactionsResp.status === HttpStatusCode.OK && allTransactionsResp.data) {
      result.items = allTransactionsResp.data.data;
      result.total = allTransactionsResp.data.recordsTotal;
    }
  } catch (error) {
    // let transactions empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getTransactionCsvBySRN(sessionId, srn, limit, offset) {
  const json2csvParser = new json2csv.Parser();
  const listTransaction = await getTransactionsBySRN(sessionId, srn, limit, offset);

  const reMappingData = listTransaction.items.map((trans) => {
    const res = {
      ID: trans.transferId,
      Source: trans.source,
      Destination: trans.dest,
      Currency: trans.currency,
      Amount: trans.amount,
      'Created at': trans.createdAt ? new Date(trans.createdAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }) : 'N/A',
      'Confirmed at': trans.confirmedAt ? new Date(trans.confirmedAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }) : 'N/A',
      'Cancelled at': trans.cancelledAt ? new Date(trans.cancelledAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }) : 'N/A',
      'Reversed at': trans.reversedAt ? new Date(trans.reversedAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }) : 'N/A',
      Message: trans.message,
      'Allow Overdraft': trans.allowOverdraft,
      Authorizer: trans.authorizer,
      'Sender provided ID': trans.senderProvidedId,
      'Reversed by': trans.reversedBy,
      Fees: trans.fees,
      Tags: JSON.stringify(trans.tags),
      'Source fees': trans.sourceFees,
      'Destination fees': trans.destFees,
      Type: trans.type,
      'Updated balance': trans.updatedBalance,
      'Updated pending balance': trans.updatedPendingBalance,
      Delta: trans.delta,
      'Source name': trans.sourceName,
      'Destination name': trans.destName,
      Status: trans.status,
    };
    return res;
  });

  return json2csvParser.parse(reMappingData);
}

async function getTransactionById(sessionId, tid) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (tid === undefined || tid === null) return false;
    const response = await axios.get(`${config.api.prefix}/transaction/${tid}?sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    // just return null
  }

  return null;
}

export default {
  getTransactionsBySRN: (sessionId, srn, limit, offset) => getTransactionsBySRN(sessionId, srn, limit, offset),
  getTransactionCsvBySRN: (sessionId, srn, limit, offset) => getTransactionCsvBySRN(sessionId, srn, limit, offset),
  getTransactionById: (sessionId, tid) => getTransactionById(sessionId, tid),
};
