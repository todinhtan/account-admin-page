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

export async function verifySession(req, res, next) {
  const verfied = await isAdmin(req.session.sessionId);
  if (!verfied) {
    delete req.session.sessionId;
    delete req.session.accountId;
    delete req.session.account;
    res.redirect('/login');
  } else {
    req.session.account = await getAccountById(req.session.sessionId, req.session.accountId);
    next();
  }
}

export async function checkSessionAdmin(sessionId) {
  const verfied = await isAdmin(sessionId);
  return verfied;
}

export async function getAccount(sessionId, accountId) {
  return getAccountById(sessionId, accountId);
}
