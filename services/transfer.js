/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function getTransfersByAccountId(sessionId, accountId) {
  let transfers = [];
  try {
    const allTransfersResp = await axios.get(`${config.api.prefix}/transfers/account:${accountId}?sessionId=${sessionId}`);
    if (allTransfersResp && allTransfersResp.status === HttpStatusCode.OK && allTransfersResp.data) {
      transfers = allTransfersResp.data.data;
    }
  } catch (error) {
    // let accounts empty
  }
  return transfers;
}

async function getTransfersByWalletId(sessionId, walletId) {
  let transfers = [];
  try {
    const allTransfersResp = await axios.get(`${config.api.prefix}/transfers/wallet:${walletId}?sessionId=${sessionId}`);
    if (allTransfersResp && allTransfersResp.status === HttpStatusCode.OK && allTransfersResp.data) {
      transfers = allTransfersResp.data.data;
    }
  } catch (error) {
    // let accounts empty
  }
  return transfers;
}

export default {
  getTransfersByAccountId: (sessionId, accountId) => getTransfersByAccountId(sessionId, accountId),
  getTransfersByWalletId: (sessionId, accountId) => getTransfersByWalletId(sessionId, accountId),
};
