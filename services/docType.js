/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import ScheduledReupDoc from '../models/scheduled_reup_docs';
import logger from '../utils/logger';

async function create(record) {
  const doc = new ScheduledReupDoc(record);
  const affectDoc = await doc.save().catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

export default {
  create: record => create(record),
};
