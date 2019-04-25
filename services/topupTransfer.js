/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import DailyTopupTransfer from '../models/daily_topup_transfers';
import logger from '../utils/logger';
import config from '../config';

async function getQueuedTopupTransfers() {
  const transfers = await DailyTopupTransfer.find({ status: 'PENDING' })
    .catch((err) => { logger.error(err); });

  return transfers ? transfers.map(v => v._doc) : [];
}

async function markDoneTopupTransfer(transferId, wyreTransferId) {
  const affectDoc = await DailyTopupTransfer.findOneAndUpdate({ wyreTransferId }, { $set: { transferId, status: 'DONE' } }, { new: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

async function finaliseTopup(sessionId, tid) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (tid === undefined || tid === null) return false;
    await axios.post(`${config.api.prefix}/transfer/${tid}/confirm?sessionId=${sessionId}`);
    // http status 2xx
    return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function createTopupTransfer(sessionId, transfer) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    const {
      source, dest, sourceCurrency, destCurrency, sourceAmount,
    } = transfer;
    const response = await axios.post(`${config.api.prefix}/transfers?sessionId=${sessionId}`, {
      autoConfirm: true,
      sourceCurrency,
      destCurrency,
      sourceAmount,
      source,
      dest,
    });
    if (response && response.status === HttpStatusCode.OK) return response.data;
  } catch (error) {
    logger.error(error.stack);
  }

  return null;
}

export default {
  getQueuedTopupTransfers: () => getQueuedTopupTransfers(),
  markDoneTopupTransfer: (transferId, wyreTransferId) => markDoneTopupTransfer(transferId, wyreTransferId),
  finaliseTopup: (sessionId, tid) => finaliseTopup(sessionId, tid),
  createTopupTransfer: (sessionId, transfer) => createTopupTransfer(sessionId, transfer),
};
