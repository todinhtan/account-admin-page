/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import services from '../services';
import config from '../config';
import logger from '../utils/logger';

export async function index(req, res) {
  let results = [];
  const errors = [];
  try {
    const transfers = await services.withdrawTransfer.getTransfers();
    results = transfers.reduce((filtered, trans) => {
      const paymentMethod = trans.dest.replace('paymentmethod:', '');
      if (!(trans.accountId in config.withdraw.source)) {
        const sourceError = `No withdraw source config found for account ${trans.accountId}`;
        if (!errors.includes(sourceError)) errors.push(`No withdraw source config found for account ${trans.accountId}`);
      } else if (!(paymentMethod in config.withdraw.paymentmethod)) {
        const paymentError = `No withdraw paymentmethod config found for ${paymentMethod}`;
        if (!errors.includes(paymentError)) errors.push(`No withdraw paymentmethod config found for ${paymentMethod}`);
      } else if (trans.sourceAmount < trans.destAmount) errors.push(`Source amount is smaller than dest amount in transfer: ${trans.id}`);
      else {
        filtered.push({
          id: trans.id,
          source: `account:${config.withdraw.source[trans.accountId]}`,
          dest: `paymentmethod:${config.withdraw.paymentmethod[paymentMethod]}`,
          destAmount: trans.destAmount,
          callbackUrl: 'https://vba.epiapi.com/callbacks/complete-transfer',
          message: trans.id,
          sourceCurrency: 'USD',
          destCurrency: 'USD',
          fee: Number(trans.sourceAmount - trans.destAmount).toFixed(2),
          feeDest: `account:${config.withdraw.feeDest}`,
        });
      }
      return filtered;
    }, []);
  } catch (error) {
    logger.error(error);
  }
  res.render('pages/withdrawTransfers', { transfers: results, errors });
}

export async function createWithdrawTransfer(req, res) {
  const isSuccess = await services.withdrawTransfer.createWithdrawTransfer(req.body);
  if (isSuccess) req.session.messages = [`Created withdraw transfer ${req.body.id} successfully`];
  else req.session.errors = [`Created withdraw transfer ${req.body.id} failed`];

  res.redirect(req.header('Referer'));
}

export async function bulkCreateWithdrawTransfers(req, res) {
  const { ids } = req.body;

  for (const id of ids) {
    const trans = await services.withdrawTransfer.getPreprocessingTransferById(id);
    if (trans) {
      const paymentMethod = trans.dest.replace('paymentmethod:', '');
      await services.withdrawTransfer.createWithdrawTransfer({
        id: trans.id,
        source: `account:${config.withdraw.source[trans.accountId]}`,
        dest: `paymentmethod:${config.withdraw.paymentmethod[paymentMethod]}`,
        destAmount: trans.destAmount,
        callbackUrl: 'https://vba.epiapi.com/callbacks/complete-transfer',
        message: trans.id,
        sourceCurrency: 'USD',
        destCurrency: 'USD',
        fee: Number(trans.sourceAmount - trans.destAmount).toFixed(2),
        feeDest: `account:${config.withdraw.feeDest}`,
      });
    }
  }

  req.session.messages = ['Created selected transfers'];

  res.redirect(req.header('Referer'));
}
