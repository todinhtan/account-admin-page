/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import DailyTopupTransfer from '../models/daily_topup_transfers';
import logger from '../utils/logger';
import config from '../config';

async function getQueuedTopupTransfers() {
  const transfers = await DailyTopupTransfer.aggregate([
    {
      $match: {
        status: 'PENDING',
      },
    },
    {
      $lookup: {
        from: 'vbarequests',
        localField: 'userId',
        foreignField: 'vbaData.userId',
        as: 'vbaRequest',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]).catch((err) => { logger.error(err); });
  // const transfers = await DailyTopupTransfer.find({ status: 'PENDING' }).sort({ createdAt: -1 })
  //   .catch((err) => { logger.error(err); });

  return transfers;
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
      source, dest, sourceCurrency, destCurrency, sourceAmount, message,
    } = transfer;
    const response = await axios.post(`${config.api.prefix}/transfers?sessionId=${sessionId}`, {
      autoConfirm: true,
      sourceCurrency,
      destCurrency,
      sourceAmount,
      source,
      dest,
      message,
    });
    if (response && response.status === HttpStatusCode.OK) return response.data;
  } catch (error) {
    logger.error(error.stack);
  }

  return null;
}

async function editTopupTransfer(updatedTransfer) {
  const { wyreTransferId } = updatedTransfer;
  const affectDoc = await DailyTopupTransfer.findOneAndUpdate({ wyreTransferId }, { $set: updatedTransfer }, { new: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

async function getTopupTransferByWyreId(wyreTransferId) {
  const doc = await DailyTopupTransfer.findOne({ wyreTransferId, status: 'PENDING' }).catch((err) => {
    logger.error(err);
  });
  return doc ? doc._doc : null;
}

async function bulkCreateTransfers(sessionId, wyreTransferIds) {
  const successIds = [];
  for (const wyreTransferId of wyreTransferIds) {
    const topupTransfer = await getTopupTransferByWyreId(wyreTransferId);
    const newTransfer = await createTopupTransfer(sessionId, topupTransfer);
    if (newTransfer) {
      successIds.push(wyreTransferId);
      await markDoneTopupTransfer(newTransfer.id, wyreTransferId);
    }
  }

  return successIds;
}

async function bulkMarkRemovedTransfers(wyreTransferIds) {
  const result = await DailyTopupTransfer.updateMany({ wyreTransferId: { $in: wyreTransferIds } }, { status: 'REMOVED' }).catch(err => logger.error(err));
  return result.nModified;
}

export default {
  getQueuedTopupTransfers: () => getQueuedTopupTransfers(),
  markDoneTopupTransfer: (transferId, wyreTransferId) => markDoneTopupTransfer(transferId, wyreTransferId),
  finaliseTopup: (sessionId, tid) => finaliseTopup(sessionId, tid),
  createTopupTransfer: (sessionId, transfer) => createTopupTransfer(sessionId, transfer),
  editTopupTransfer: updatedTransfer => editTopupTransfer(updatedTransfer),
  bulkCreateTransfers: (sessionId, wyreTransferIds) => bulkCreateTransfers(sessionId, wyreTransferIds),
  bulkMarkRemovedTransfers: wyreTransferIds => bulkMarkRemovedTransfers(wyreTransferIds),
};
