/* eslint-disable max-len */
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import moment from 'moment';
import 'moment-timezone';
import config from './config';
import logger from './utils/logger';
import routes from './routes';

const app = express();
app.use(session({
  secret: '59HSWMPdhcRhgcJ5',
  resave: false,
  saveUninitialized: true,
}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to make session variables available to all templates
app.use((req, res, next) => {
  moment.tz.setDefault('Asia/Shanghai');
  // inject moment
  res.locals.moment = moment;
  res.locals.account = req.session.account;
  res.locals.messages = req.session.messages;
  req.session.messages = [];
  res.locals.errors = req.session.errors;
  req.session.errors = [];

  // storing page size for each table
  if (req.session.accountPageSize === undefined) req.session.accountPageSize = config.api.pageSize;
  if (req.session.walletPageSize === undefined) req.session.walletPageSize = config.api.pageSize;
  if (req.session.transferPageSize === undefined) req.session.transferPageSize = config.api.pageSize;
  if (req.session.transactionPageSize === undefined) req.session.transactionPageSize = config.api.pageSize;
  if (req.session.sessionPageSize === undefined) req.session.sessionPageSize = config.api.pageSize;
  res.locals.pageSize = {
    account: req.session.accountPageSize,
    wallet: req.session.walletPageSize,
    transfer: req.session.transferPageSize,
    transaction: req.session.transactionPageSize,
    session: req.session.sessionPageSize,
  };
  next();
});


app.use('/base', express.static('./node_modules/admin-lte'));
app.use('/resources', express.static('./views/resources'));
app.use('/', routes);

app.listen(config.server.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info(
    `API is now running on port ${config.server.port} in ${config.env} mode`,
  );
});

export default app;
