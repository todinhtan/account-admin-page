/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
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

async function searchWallet(sessionId, keyword, type) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    switch (type) {
      case 'id':
        const response = await axios.get(`${config.api.prefix}/wallet?sessionId=${sessionId}&walletId=${keyword}`);
        if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
        break;
      case 'name':
        const resp = await axios.get(`${config.api.prefix}/wallet?sessionId=${sessionId}&name=${keyword}`);
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

async function updateStatus(sessionId, walletId, status) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;
    if (!['NEED_ATTENTION', 'APPROVED', 'REJECTED', 'DISABLED'].includes(status)) return false;
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/status?sessionId=${sessionId}`, {
      status,
      reason: 'made by admin',
    });
    if (response && response.status === HttpStatusCode.OK && response.data) return true;
  } catch (error) {
    // just return false
  }
  return false;
}

async function updateVerification(sessionId, walletId, vbaVerificationData) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;

    // rebuild post param
    for (const key of Object.keys(vbaVerificationData)) {
      if (!vbaVerificationData[key]) delete vbaVerificationData[key];
    }
    if (vbaVerificationData.address != null) {
      if (!vbaVerificationData.address.street1
        || !vbaVerificationData.address.street2
        || !vbaVerificationData.address.city
        || !vbaVerificationData.address.state
        || !vbaVerificationData.address.postalCode
        || !vbaVerificationData.address.country) delete vbaVerificationData.address;
    }
    if (vbaVerificationData.repAddress != null) {
      if (!vbaVerificationData.repAddress.street1
        || !vbaVerificationData.repAddress.street2
        || !vbaVerificationData.repAddress.city
        || !vbaVerificationData.repAddress.state
        || !vbaVerificationData.repAddress.postalCode
        || !vbaVerificationData.repAddress.country) delete vbaVerificationData.repAddress;
    }

    if (vbaVerificationData.merchantId.length > 0) {
      vbaVerificationData.merchantIds = [];
      // merchant
      for (let i = 0; i < vbaVerificationData.merchantId.length; i++) {
        vbaVerificationData.merchantIds.push({
          merchantId: vbaVerificationData.merchantId[i],
          merchantIdType: vbaVerificationData.merchantIdType[i],
          merchantIdCountry: vbaVerificationData.merchantIdCountry[i],
        });
      }

      delete vbaVerificationData.merchantId;
      delete vbaVerificationData.merchantIdType;
      delete vbaVerificationData.merchantIdCountry;
    }
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/update?sessionId=${sessionId}`, { vbaVerificationData });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    // just return false
  }
  return false;
}

export default {
  getWalletsByAccountId: (sessionId, accountId, limit, offset) => getWalletsByAccountId(sessionId, accountId, limit, offset),
  getWalletById: (sessionId, walletId) => getWalletById(sessionId, walletId),
  getWalletName: (sessionId, walletId) => getWalletName(sessionId, walletId),
  updateNote: (sessionId, walletId, notes) => updateNote(sessionId, walletId, notes),
  searchWallet: (sessionId, keyword, type) => searchWallet(sessionId, keyword, type),
  updateStatus: (sessionId, walletId, status) => updateStatus(sessionId, walletId, status),
  updateVerification: (sessionId, walletId, vbaVerificationData) => updateVerification(sessionId, walletId, vbaVerificationData),
};
