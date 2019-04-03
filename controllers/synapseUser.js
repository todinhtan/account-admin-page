/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';

export async function getQueuedSynapseUsers(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * 50;
  let listSynapseUsers = {};
  try {
    listSynapseUsers = await services.synapseUserService.getQueuedSynapseUsers(50, offset);
  } catch (error) {
    // let accounts empty
  }
  res.render('pages/synapseUser', { listSynapseUsers });
}

export async function getQueuedSynapseUsersAjax(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * 50;
  let listSynapseUsers = {};
  try {
    listSynapseUsers = await services.synapseUserService.getQueuedSynapseUsers(50, offset);
  } catch (error) {
    // let accounts empty
  }
  res.render('ajax/synapseUser', { listSynapseUsers });
}

export async function getSynapseUserByIdAjax(req, res) {
  if (!req.xhr) return res.send(null);
  const user = await services.synapseUserService.getSynapseUserById(req.params.userId);
  return res.json(user);
}
