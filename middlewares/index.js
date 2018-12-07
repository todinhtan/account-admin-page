/* eslint-disable max-len */
import services from '../services';

export async function verifySession(req, res, next) {
  const verfied = await services.accountService.isAdmin(req.session.sessionId);
  if (!verfied) {
    services.sessionService.clearSession(req);
    res.redirect('/login');
  } else {
    req.session.account = await services.accountService.getAccountById(req.session.sessionId, req.session.accountId);
    next();
  }
}

export async function checkSessionAdmin(sessionId) {
  const verfied = await services.accountService.isAdmin(sessionId);
  return verfied;
}
