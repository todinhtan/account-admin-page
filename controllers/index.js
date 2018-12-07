import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';
import { checkSessionAdmin, getAccount } from '../middlewares';

export async function getLogin(req, res) {
  const verfied = await checkSessionAdmin(req.session.sessionId);
  if (verfied) {
    res.redirect('/');
  } else {
    delete req.session.sessionId;
    delete req.session.accountId;
    delete req.session.account;
    res.render('pages/login');
  }
}

export async function postLogin(req, res) {
  const { email, password } = req.body;

  try {
    const response = await axios.post(`${config.api.prefix}/sessions/auth`, { email, password });
    if (response && response.status === HttpStatusCode.OK
      && response.data && response.data.sessionId) {
      const isAdmin = await checkSessionAdmin(response.data.sessionId);
      if (isAdmin) {
        req.session.sessionId = response.data.sessionId;
        req.session.accountId = response.data.authenticatedAs.replace('account:', '');
        req.session.account = await getAccount(req.session.sessionId, req.session.accountId);
        res.redirect('/');
      } else res.render('pages/login', { error: 'Only administrator can access the page' });
    }
  } catch (error) {
    res.render('pages/login', { error: 'Invalid email or password' });
  }
}

export async function getIndex(req, res) {
  let accounts = [];
  try {
    const allAccountsResp = await axios.get(`${config.api.prefix}/accounts?sessionId=${req.session.sessionId}`);
    if (allAccountsResp && allAccountsResp.status === HttpStatusCode.OK && allAccountsResp.data) {
      accounts = allAccountsResp.data.data;
    }
  } catch (error) {
    // let accounts empty
  }
  res.render('pages/index', {
    accounts,
  });
}

export function logout(req, res) {
  delete req.session.sessionId;
  delete req.session.accountId;
  delete req.session.account;
  res.redirect('/login');
}
