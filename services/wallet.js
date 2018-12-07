import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function getWalletsByAccountId(sessionId, accountId) {
  let wallets = [];
  try {
    const allWalletsResp = await axios.get(`${config.api.prefix}/wallets?accountId=${accountId}&sessionId=${sessionId}`);
    if (allWalletsResp && allWalletsResp.status === HttpStatusCode.OK && allWalletsResp.data) {
      wallets = allWalletsResp.data.data;
    }
  } catch (error) {
    // let accounts empty
  }
  return wallets;
}

async function getWalletById(sessionId, walletId) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    if (walletId === undefined || walletId === null) return null;
    const response = await axios.get(`${config.api.prefix}/wallet/${walletId}?sessionId=${sessionId}`);
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

export default {
  getWalletsByAccountId: (sessionId, accountId) => getWalletsByAccountId(sessionId, accountId),
  getWalletById: (sessionId, walletId) => getWalletById(sessionId, walletId),
  getWalletName: (sessionId, walletId) => getWalletName(sessionId, walletId),
};
