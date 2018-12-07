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

export default {
  getWalletsByAccountId: (sessionId, accountId) => getWalletsByAccountId(sessionId, accountId),
};
