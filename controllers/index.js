/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';
import { checkSessionAdmin } from '../middlewares';
import services from '../services';

export async function getLogin(req, res) {
  const verfied = await checkSessionAdmin(req.session.sessionId);
  if (verfied) {
    res.redirect('/');
  } else {
    services.sessionService.clearSession(req);
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
        req.session.account = await services.accountService.getAccountById(req.session.sessionId, req.session.accountId);
        res.redirect('/');
      } else res.render('pages/login', { error: 'Only administrator can access the page' });
    }
  } catch (error) {
    res.render('pages/login', { error: 'Invalid email or password' });
  }
}

export async function getIndex(req, res) {
  let listAccount = {};
  try {
    listAccount = await services.accountService.getAccounts(req.session.sessionId, req.session.accountPageSize, 0);
  } catch (error) {
    // let accounts empty
  }
  res.render('pages/index', {
    listAccount,
  });
}

export function logout(req, res) {
  services.sessionService.clearSession(req);
  res.redirect('/login');
}

export function updatePagesize(req, res) {
  switch (req.body.type) {
    case 'account':
      req.session.accountPageSize = req.body.pagesize;
      break;
    case 'wallet':
      req.session.walletPageSize = req.body.pagesize;
      break;
    case 'transfer':
      req.session.transferPageSize = req.body.pagesize;
      break;
    case 'transaction':
      req.session.transactionPageSize = req.body.pagesize;
      break;
    case 'session':
      req.session.sessionPageSize = req.body.pagesize;
      break;
    default:
      break;
  }
  res.redirect(req.header('Referer'));
}
