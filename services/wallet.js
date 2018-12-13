/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function getWalletsByAccountId(sessionId, accountId, limit, offset) {
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
    const allWalletsResp = await axios.get(`${config.api.prefix}/wallets?accountId=${accountId}&sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allWalletsResp && allWalletsResp.status === HttpStatusCode.OK && allWalletsResp.data) {
      result.items = allWalletsResp.data.data;
      result.total = allWalletsResp.data.recordsTotal;
    }
  } catch (error) {
    // let accounts empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getWalletById(sessionId, walletId) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    if (walletId === undefined || walletId === null) return null;
    const response = await axios.get(`${config.api.prefix}/wallet?walletId=${walletId}&sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    // just return false
  }
  return null;
}

async function getWalletName(sessionId, walletId) {
  const wallet = await getWalletById(sessionId, walletId);
  if (wallet) return wallet.name;
  return '';
}

async function updateNote(sessionId, walletId, notes) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/update?sessionId=${sessionId}`, { notes });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    // just return false
  }
  return false;
}

async function searchWallet(sessionId, accountId, keyword, type) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    switch (type) {
      case 'id':
        const response = await axios.get(`${config.api.prefix}/wallet/${accountId}?sessionId=${sessionId}&walletId=${keyword}`);
        if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
        break;
      case 'name':
        const resp = await axios.get(`${config.api.prefix}/wallet/${accountId}?sessionId=${sessionId}&name=${keyword}`);
        if (resp && resp.status === HttpStatusCode.OK && resp.data) return resp.data;
        break;
      default:
        return null;
    }
  } catch (error) {
    // just return false
  }
  return null;
}

export default {
  getWalletsByAccountId: (sessionId, accountId, limit, offset) => getWalletsByAccountId(sessionId, accountId, limit, offset),
  getWalletById: (sessionId, walletId) => getWalletById(sessionId, walletId),
  getWalletName: (sessionId, walletId) => getWalletName(sessionId, walletId),
  updateNote: (sessionId, walletId, notes) => updateNote(sessionId, walletId, notes),
  searchWallet: (sessionId, accountId, keyword, type) => searchWallet(sessionId, accountId, keyword, type),
};
