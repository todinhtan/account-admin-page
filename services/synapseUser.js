/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import SynapseUser from '../models/synapse_users';
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

export default {
  getQueuedSynapseUsers: (limit, offset) => getQueuedSynapseUsers(limit, offset),
  getSynapseUserById: userId => getSynapseUserById(userId),
};
