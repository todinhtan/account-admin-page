/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/prefer-default-export */
import VbaRequest from '../models/vba';
import logger from '../utils/logger';

async function getUnauthorizedVba(limit, offset) {
  const result = {
    items: [],
    total: 0,
    size: 50,
  };
  let l = parseInt(limit, 10);
  let o = parseInt(offset, 10);
  if (isNaN(l) || l < 1) l = 50;
  if (isNaN(o) || o < 1) o = 0;

  result.size = l;
  const vbas = await VbaRequest.find({ country: 'US', 'vbaData.userId': { $exists: true }, $or: [{ authorization: { $exists: false } }, { authorization: 'PENDING' }] })
    .skip(offset).limit(limit)
    .catch((err) => { logger.error(err); });
  if (vbas) result.items = vbas.map(v => v._doc);
  result.total = await VbaRequest.find({ country: 'US', 'vbaData.userId': { $exists: true }, $or: [{ authorization: { $exists: false } }, { authorization: 'PENDING' }] }).count();

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function markDoneUnauthorizedVba(walletId) {
  const doc = await VbaRequest.findOneAndUpdate({ walletId }, { $set: { authorization: 'DONE' } }, { new: true });
  return !!doc;
}

export default {
  getUnauthorizedVba: (limit, offset) => getUnauthorizedVba(limit, offset),
  markDoneUnauthorizedVba: walletId => markDoneUnauthorizedVba(walletId),
};
