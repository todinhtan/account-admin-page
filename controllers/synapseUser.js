/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import pinyin from 'pinyin';
import moment from 'moment';
import services from '../services';

export async function getQueuedSynapseUsers(req, res) {
  // let page = parseInt(req.query.page, 10);
  // if (isNaN(page) || page < 1) page = 1;
  // const offset = (page - 1) * 50;
  // let listSynapseUsers = {};
  // try {
  //   listSynapseUsers = await services.synapseUserService.getQueuedSynapseUsers(50, offset);
  // } catch (error) {
  //   // let accounts empty
  // }
  // res.render('pages/synapseUser', { listSynapseUsers });
  const synapseUsers = await services.synapseUserService.getAllSynapseUsers();
  res.render('pages/synapseUser', { synapseUsers });
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

export async function getVbaByWalletIdAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let wallet = null;
    try {
      wallet = await services.vbaService.getVbaByWallet(req.params.walletId);
      if (wallet.idDoc) wallet.idDocUri = await services.documentService.getDocumentUri(req.session.sessionId, wallet.idDoc);
      if (wallet.nameEn) wallet.nameEn = pinyin(wallet.nameEn, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.nameCn) wallet.nameCn = pinyin(wallet.nameCn, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.street1 = pinyin(wallet.address.street1, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.street2 = pinyin(wallet.address.street2, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.city = pinyin(wallet.address.city, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.state = pinyin(wallet.address.state, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.postalCode = pinyin(wallet.address.postalCode, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.address) wallet.address.country = pinyin(wallet.address.country, { style: pinyin.STYLE_NORMAL }).join(' ');
      if (wallet.dateOfBirth) wallet.dobString = moment(wallet.dateOfBirth, 'x').format('MM/DD/YYYY');
    } catch (error) {
      // let wallet empty
    }
    res.send(wallet);
  }
}

export async function insertDeactiveNode(req, res) {
  try {
    const { userId } = req.params;
    const success = await services.synapseUserService.insertDeactiveNode(userId);
    if (success) req.session.messages = ['Inserted deactive node successfully'];
    else req.session.errors = ['Failed'];
  } catch (error) {
    // let accounts empty
  }
  res.redirect(req.header('Referer'));
}

export async function insertLockUser(req, res) {
  try {
    const { userId } = req.params;
    const success = await services.synapseUserService.insertLockUser(userId);
    if (success) req.session.messages = ['Inserted lock user successfully'];
    else req.session.errors = ['Failed'];
  } catch (error) {
    // let accounts empty
  }
  res.redirect(req.header('Referer'));
}
