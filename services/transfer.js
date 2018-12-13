/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import json2csv from 'json2csv';

import config from '../config';

async function getTransfersBySRN(sessionId, srn, limit, offset) {
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
    const allTransfersResp = await axios.get(`${config.api.prefix}/transfers/${srn}?sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allTransfersResp && allTransfersResp.status === HttpStatusCode.OK && allTransfersResp.data) {
      result.items = allTransfersResp.data.data;
      result.total = allTransfersResp.data.recordsTotal;
    }
  } catch (error) {
    // let accounts empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getTransferCsvBySRN(sessionId, srn, limit, offset) {
  const json2csvParser = new json2csv.Parser();
  const listTransfer = await getTransfersBySRN(sessionId, srn, limit, offset);
  const reMappingData = listTransfer.items.map((trans) => {
    const res = {
      ID: trans.id,
      'Created at': new Date(trans.createdAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }),
      'Closed at': new Date(trans.closedAt).toLocaleDateString({}, {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      }),
      'Custom ID': trans.customId,
      Source: trans.source,
      Destination: trans.dest,
      'Source amount': trans.sourceAmount,
      'Destination amount': trans.destAmount,
      'Source currency': trans.sourceCurrency,
      'Destination currency': trans.destCurrency,
      Type: trans.type,
      'Source name': trans.sourceName,
      'Destination name': trans.destName,
      Status: trans.status,
      Message: trans.message,
      'Exchange rate': trans.exchangeRate,
      'Blockchain TxID': trans.blockchainTxId,
      'Destination nickname': trans.destNickname,
      USDDebit: trans.USDDebit,
      USDFeeDebit: trans.USDFeeDebit,
    };
    return res;
  });
  return json2csvParser.parse(reMappingData);
}

export default {
  getTransfersBySRN: (sessionId, srn, limit, offset) => getTransfersBySRN(sessionId, srn, limit, offset),
  getTransferCsvBySRN: (sessionId, srn, limit, offset) => getTransferCsvBySRN(sessionId, srn, limit, offset),
};
