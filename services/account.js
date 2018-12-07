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

export default {
  isAdmin: sessionId => isAdmin(sessionId),
  getAccountById: (sessionId, accountId) => getAccountById(sessionId, accountId),
  getAccountName: (sessionId, accountId) => getAccountName(sessionId, accountId),
};
