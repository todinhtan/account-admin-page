/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function isAdmin(sessionId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    const response = await axios.get(`${config.api.prefix}/permissions/admin?sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK
      && response.data && response.data === true) return true;
  } catch (error) {
    // just return false
  }
  return false;
}

async function getAccountById(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    if (accountId === undefined || accountId === null) return null;
    const response = await axios.get(`${config.api.prefix}/account/${accountId}?sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    // just return false
  }
  return null;
}

async function getAccountName(sessionId, accountId) {
  const account = await getAccountById(sessionId, accountId);
  if (account) return account.profile.name;
  return '';
}

async function disableAccount(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markForDisable?sessionId=${sessionId}`, { reason: 'made by admin' });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function getSessionHistory(sessionId, accountId, limit, offset) {
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
    const allSessionsResp = await axios.get(`${config.api.prefix}/sessions/${accountId}?sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allSessionsResp && allSessionsResp.status === HttpStatusCode.OK && allSessionsResp.data) {
      result.items = allSessionsResp.data.data;
      result.total = allSessionsResp.data.recordsTotal;
    }
  } catch (error) {
    // just return empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getAccounts(sessionId, limit, offset) {
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
    const allAccountsResp = await axios.get(`${config.api.prefix}/accounts?sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allAccountsResp && allAccountsResp.status === HttpStatusCode.OK && allAccountsResp.data) {
      result.items = allAccountsResp.data.data;
      result.total = allAccountsResp.data.recordsTotal;
    }
  } catch (error) {
    // leave empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function searchByKeyword(sessionId, keyword, limit, offset) {
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
    const allAccountsResp = await axios.get(`${config.api.prefix}/accounts?sessionId=${sessionId}&query=${keyword}&limit=${l}&offset=${o}`);
    if (allAccountsResp && allAccountsResp.status === HttpStatusCode.OK && allAccountsResp.data) {
      result.items = allAccountsResp.data.data;
      result.total = allAccountsResp.data.recordsTotal;
    }
  } catch (error) {
    // leave empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function markUnderReview(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markForUnderReview?sessionId=${sessionId}`, { reason: 'made by admin' });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function markNeedAttention(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markForNeedAttention?sessionId=${sessionId}`, { reason: 'made by admin' });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function markApproved(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markForApproved?sessionId=${sessionId}`, { reason: 'made by admin' });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function markRejected(sessionId, accountId) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markForRejected?sessionId=${sessionId}`, { reason: 'made by admin' });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function verifyIdentity(sessionId, accountId, identity) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    if (identity === undefined || identity === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/markIdentityVerified?sessionId=${sessionId}`, { identity });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function removeIdentity(sessionId, accountId, identity) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (accountId === undefined || accountId === null) return false;
    if (identity === undefined || identity === null) return false;
    const response = await axios.post(`${config.api.prefix}/account/${accountId}/removeIdentity?sessionId=${sessionId}`, { srn: identity });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

async function sendResetPassword(sessionId, identity) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (identity === undefined || identity === null) return false;
    const response = await axios.post(`${config.api.prefix}/sendResetPassword?sessionId=${sessionId}`, { identity });
    if (response && (response.status === HttpStatusCode.OK || response.status === HttpStatusCode.NO_CONTENT)) return true;
  } catch (error) {
    // just return false
  }

  return false;
}

export default {
  isAdmin: sessionId => isAdmin(sessionId),
  getAccountById: (sessionId, accountId) => getAccountById(sessionId, accountId),
  getAccountName: (sessionId, accountId) => getAccountName(sessionId, accountId),
  disableAccount: (sessionId, accountId) => disableAccount(sessionId, accountId),
  getSessionHistory: (sessionId, accountId, limit, offset) => getSessionHistory(sessionId, accountId, limit, offset),
  getAccounts: (sessionId, limit, offset) => getAccounts(sessionId, limit, offset),
  searchByKeyword: (sessionId, keyword, limit, offset) => searchByKeyword(sessionId, keyword, limit, offset),
  markUnderReview: (sessionId, accountId) => markUnderReview(sessionId, accountId),
  markNeedAttention: (sessionId, accountId) => markNeedAttention(sessionId, accountId),
  markApproved: (sessionId, accountId) => markApproved(sessionId, accountId),
  markRejected: (sessionId, accountId) => markRejected(sessionId, accountId),
  verifyIdentity: (sessionId, accountId, identity) => verifyIdentity(sessionId, accountId, identity),
  removeIdentity: (sessionId, accountId, identity) => removeIdentity(sessionId, accountId, identity),
  sendResetPassword: (sessionId, identity) => sendResetPassword(sessionId, identity),
};
