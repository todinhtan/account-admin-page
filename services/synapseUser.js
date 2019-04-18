/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import SynapseUser from '../models/synapse_users';
import DeactiveNode from '../models/deactive_nodes';
import LockUser from '../models/lock_users';
import logger from '../utils/logger';

async function getQueuedSynapseUsers(limit, offset) {
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
  const users = await SynapseUser.find({ permission: { $ne: 'SEND-AND-RECEIVE' } })
    .skip(offset).limit(limit)
    .catch((err) => { logger.error(err); });
  if (users) result.items = users.map(v => v._doc);
  result.total = await SynapseUser.count({ permission: { $ne: 'SEND-AND-RECEIVE' } });

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getSynapseUserById(userId) {
  const user = await SynapseUser.findOne({ userId }).catch((err) => { logger.error(err); });
  return user ? user._doc : null;
}

async function getSynapseUserByWalletId(walletId) {
  const user = await SynapseUser.findOne({ walletId }).catch((err) => { logger.error(err); });
  return user ? user._doc : null;
}

async function insertDeactiveNode(userId) {
  const affectDoc = await DeactiveNode.findOneAndUpdate({ userId }, { $set: { userId, status: 'PENDING' } }, { new: true, upsert: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

async function checkIsDeactivatedNode(userId) {
  const doc = await DeactiveNode.findOne({ userId }).catch((err) => {
    logger.error(err);
  });
  return !!doc;
}

async function insertLockUser(userId) {
  const affectDoc = await LockUser.findOneAndUpdate({ userId }, { $set: { userId, status: 'PENDING' } }, { new: true, upsert: true }).catch((err) => {
    logger.error(err);
  });
  return !!affectDoc;
}

async function checkIsLockedUser(userId) {
  const doc = await LockUser.findOne({ userId }).catch((err) => {
    logger.error(err);
  });
  return !!doc;
}

export default {
  getQueuedSynapseUsers: (limit, offset) => getQueuedSynapseUsers(limit, offset),
  getSynapseUserById: userId => getSynapseUserById(userId),
  getSynapseUserByWalletId: walletId => getSynapseUserByWalletId(walletId),
  insertDeactiveNode: userId => insertDeactiveNode(userId),
  checkIsDeactivatedNode: userId => checkIsDeactivatedNode(userId),
  insertLockUser: userId => insertLockUser(userId),
  checkIsLockedUser: userId => checkIsLockedUser(userId),
};
