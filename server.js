/* eslint-disable max-len */
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

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

// middleware to make 'user' available to all templates
app.use((req, res, next) => {
  res.locals.account = req.session.account;
  res.locals.messages = req.session.messages;
  req.session.messages = [];
  next();
});


app.use('/base', express.static('./node_modules/admin-lte'));
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
