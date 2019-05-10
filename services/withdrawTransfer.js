/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import PreprocessingWithdrawTransfer from '../models/preprocessing_withdraw_transfers';
import DailyWithdrawTransfer from '../models/daily_withdraw_transfers';
import logger from '../utils/logger';

async function getTransfers() {
  const transfers = await PreprocessingWithdrawTransfer.find({ status: 'PENDING' }).catch(err => logger.error(err));
  return transfers ? transfers.map(t => t._doc) : [];
}

async function markDonePreprocessingTransfer(id) {
  const affectDoc = await PreprocessingWithdrawTransfer.findOneAndUpdate({ id }, { $set: { status: 'DONE' } }, { new: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

async function getPreprocessingTransferById(id) {
  const transfer = await PreprocessingWithdrawTransfer.findOne({ id, status: 'PENDING' }).catch(err => logger.error(err));
  return transfer ? transfer._doc : null;
}

async function createWithdrawTransfer(transfer) {
  const doc = new DailyWithdrawTransfer({ ...transfer, status: 'PENDING' });
  const affectDoc = await doc.save().catch((err) => {
    logger.error(err);
  });
  const isSuccess = !!affectDoc;
  if (isSuccess) await markDonePreprocessingTransfer(transfer.id);
  return isSuccess;
}

export default {
  getTransfers: () => getTransfers(),
  createWithdrawTransfer: transfer => createWithdrawTransfer(transfer),
  getPreprocessingTransferById: id => getPreprocessingTransferById(id),
};
