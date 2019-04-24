/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import DailyTopupTransfer from '../models/daily_topup_transfers';
import logger from '../utils/logger';

async function getQueuedTopupTransfers() {
  const transfers = await DailyTopupTransfer.find({ status: 'PENDING' })
    .catch((err) => { logger.error(err); });

  return transfers ? transfers.map(v => v._doc) : [];
}

async function markDoneTopupTransfer(transferId) {
  const affectDoc = await DailyTopupTransfer.findOneAndUpdate({ transferId }, { $set: { status: 'DONE' } }, { new: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

export default {
  getQueuedTopupTransfers: () => getQueuedTopupTransfers(),
  markDoneTopupTransfer: transferId => markDoneTopupTransfer(transferId),
};
