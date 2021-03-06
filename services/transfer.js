/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import json2csv from 'json2csv';
import moment from 'moment';
import 'moment-timezone';

import config from '../config';
import logger from '../utils/logger';

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
    logger.error(error);
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getTransfersBySRNWithRange(sessionId, srn, limit, offset, from, to) {
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
    const allTransfersResp = await axios.get(`${config.api.prefix}/transfers/${srn}?sessionId=${sessionId}&from=${from}&to=${to}&limit=${l}&offset=${o}`);
    if (allTransfersResp && allTransfersResp.status === HttpStatusCode.OK && allTransfersResp.data) {
      result.items = allTransfersResp.data.data;
      result.total = allTransfersResp.data.recordsTotal;
    }
  } catch (error) {
    logger.error(error);
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getTransferCsvBySRN(sessionId, srn, limit, offset, from, to) {
  const json2csvParser = new json2csv.Parser();
  const listTransfer = await getTransfersBySRNWithRange(sessionId, srn, limit, offset, from, to);
  const reMappingData = listTransfer.items.map((trans) => {
    const res = {
      ID: trans.id,
      'Created at': trans.createdAt ? moment(trans.createdAt).tz(config.tz).format('LLLL') : 'N/A',
      'Closed at': trans.closedAt ? moment(trans.closedAt).tz(config.tz).format('LLLL') : 'N/A',
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
  return reMappingData.length ? json2csvParser.parse(reMappingData) : [];
}

async function getTransferById(sessionId, tid) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (tid === undefined || tid === null) return false;
    const response = await axios.get(`${config.api.prefix}/transfer/${tid}?sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    logger.error(error);
  }

  return false;
}

async function addFunds(sessionId, amount, srn) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (srn === undefined || srn === null) return false;
    const response = await axios.post(`${config.api.prefix}/transfers?sessionId=${sessionId}`, {
      autoConfirm: true,
      callbackUrl: 'http://requestbin.net/r/t18808t1?inspect',
      sourceCurrency: 'USD',
      destCurrency: 'USD',
      sourceAmount: amount,
      source: 'service:Fiat Credits',
      dest: srn,
    });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    logger.error(error);
  }

  return true;
}

async function finalise(sessionId, tid) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (tid === undefined || tid === null) return false;
    await axios.post(`${config.api.prefix}/transfer/${tid}/finalise?sessionId=${sessionId}`);
    // http status 2xx
    return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

export default {
  getTransfersBySRN: (sessionId, srn, limit, offset) => getTransfersBySRN(sessionId, srn, limit, offset),
  getTransferCsvBySRN: (sessionId, srn, limit, offset, from, to) => getTransferCsvBySRN(sessionId, srn, limit, offset, from, to),
  getTransferById: (sessionId, tid) => getTransferById(sessionId, tid),
  addFunds: (sessionId, amount, srn) => addFunds(sessionId, amount, srn),
  finalise: (sessionId, tid) => finalise(sessionId, tid),
};
