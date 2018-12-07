function clearSession(req) {
  delete req.session.sessionId;
  delete req.session.accountId;
  delete req.session.account;
}

export default {
  clearSession: req => clearSession(req),
};
