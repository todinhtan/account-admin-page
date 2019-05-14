/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';
import AuthorizeDoc from '../models/authorize_doc';
import VbaRequest from '../models/vba';

import logger from '../utils/logger';
import config from '../config';
import documentService from './document';

async function getWalletsByAccountId(sessionId, accountId, limit, offset) {
  const result = {
    items: [],
    total: 0,
    size: config.api.pageSize,
  };
  let l = parseInt(limit, 10);
  let o = parseInt(offset, 10);
  if (isNaN(l) || l < 1) l = config.api.pageSize;
  if (isNaN(o) || o < 1) o = 0;

  result.size = l;

  try {
    const allWalletsResp = await axios.get(`${config.api.prefix}/wallets?accountId=${accountId}&sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (allWalletsResp && allWalletsResp.status === HttpStatusCode.OK && allWalletsResp.data) {
      result.items = allWalletsResp.data.data;
      result.total = allWalletsResp.data.recordsTotal;
    }
  } catch (error) {
    logger.error(error);
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getWalletById(sessionId, walletId) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    if (walletId === undefined || walletId === null) return null;
    const response = await axios.get(`${config.api.prefix}/wallet?walletId=${walletId}&sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    logger.error(error);
  }
  return null;
}

async function getWalletName(sessionId, walletId) {
  const wallet = await getWalletById(sessionId, walletId);
  if (wallet) return wallet.name;
  return '';
}

async function updateNote(sessionId, walletId, notes) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/update?sessionId=${sessionId}`, { notes });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function searchWallet(sessionId, keyword, type) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    switch (type) {
      case 'id':
        const response = await axios.get(`${config.api.prefix}/wallet?sessionId=${sessionId}&walletId=${keyword}`);
        if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
        break;
      case 'name':
        const resp = await axios.get(`${config.api.prefix}/wallet?sessionId=${sessionId}&name=${keyword}`);
        if (resp && resp.status === HttpStatusCode.OK && resp.data) return resp.data;
        break;
      default:
        return null;
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
}

async function updateStatus(sessionId, walletId, status) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;
    if (!['NEED_ATTENTION', 'APPROVED', 'REJECTED', 'DISABLED'].includes(status)) return false;
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/status?sessionId=${sessionId}`, {
      status,
      reason: 'made by admin',
    });
    if (response && response.status === HttpStatusCode.OK && response.data) return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function updateVerification(sessionId, walletId, vbaVerificationData) {
  try {
    if (sessionId === undefined || sessionId === null) return false;
    if (walletId === undefined || walletId === null) return false;

    // rebuild post param
    for (const key of Object.keys(vbaVerificationData)) {
      if (!vbaVerificationData[key]) delete vbaVerificationData[key];
    }
    if (vbaVerificationData.address != null) {
      if (!vbaVerificationData.address.street1
        || !vbaVerificationData.address.street2
        || !vbaVerificationData.address.city
        || !vbaVerificationData.address.state
        || !vbaVerificationData.address.postalCode
        || !vbaVerificationData.address.country) delete vbaVerificationData.address;
    }
    if (vbaVerificationData.repAddress != null) {
      if (!vbaVerificationData.repAddress.street1
        || !vbaVerificationData.repAddress.street2
        || !vbaVerificationData.repAddress.city
        || !vbaVerificationData.repAddress.state
        || !vbaVerificationData.repAddress.postalCode
        || !vbaVerificationData.repAddress.country) delete vbaVerificationData.repAddress;
    }

    if (vbaVerificationData.merchantId && vbaVerificationData.merchantId.length > 0) {
      vbaVerificationData.merchantIds = [];
      // merchant
      for (let i = 0; i < vbaVerificationData.merchantId.length; i++) {
        vbaVerificationData.merchantIds.push({
          merchantId: vbaVerificationData.merchantId[i],
          merchantIdType: vbaVerificationData.merchantIdType[i],
          merchantIdCountry: vbaVerificationData.merchantIdCountry[i],
        });
      }

      delete vbaVerificationData.merchantId;
      delete vbaVerificationData.merchantIdType;
      delete vbaVerificationData.merchantIdCountry;
    }
    const response = await axios.post(`${config.api.prefix}/wallet/${walletId}/update?sessionId=${sessionId}`, { vbaVerificationData });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function updateVbaData(walletId, country, vbaData) {
  try {
    if (country === undefined || country === null || country === '') return false;
    if (walletId === undefined || walletId === null) return false;

    const response = await axios.post(`${config.api.vbaPrefix}/vba/${walletId}/vbaData/${country}`, vbaData, {
      auth: {
        username: 'admin',
        password: 'adm1nadm1n',
      },
    });
    if (response && response.status === HttpStatusCode.OK) return true;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function saveAuthorizeDoc(walletId, docData, adminAccountId, adminAccountName) {
  const vbaRequest = await VbaRequest.findOne({ walletId }).catch((err) => { logger.error(err); });
  if (vbaRequest && vbaRequest._doc && vbaRequest._doc.vbaData && vbaRequest._doc.vbaData.userId) {
    const { userId } = vbaRequest._doc.vbaData;
    const newRecord = {
      walletId,
      userId,
      ...docData,
      adminAccountId,
      adminAccountName,
    };

    const affectedDoc = await AuthorizeDoc.findOneAndUpdate({ walletId }, { $set: { ...newRecord, status: 'PENDING' } }, { new: true, upsert: true }).catch((err) => {
      logger.error(err);
    });

    await VbaRequest.update({ walletId }, { $set: { authorization: 'DONE' } }).catch((err) => {
      logger.error(err);
    });

    return !!affectedDoc;
  }
  return false;
}

async function findAuthorizeDocByWallet(walletId) {
  const doc = await AuthorizeDoc.findOne({ walletId }).catch((err) => { logger.error(err); });
  return doc;
}

async function updateVerificationToVbaService(walletId, vbaVerificationData) {
  try {
    if (walletId === undefined || walletId === null) return false;

    // rebuild post param
    for (const key of Object.keys(vbaVerificationData)) {
      if (!vbaVerificationData[key]) delete vbaVerificationData[key];
    }
    if (vbaVerificationData.address != null) {
      if (!vbaVerificationData.address.street1
        || !vbaVerificationData.address.city
        || !vbaVerificationData.address.state
        || !vbaVerificationData.address.postalCode
        || !vbaVerificationData.address.country) delete vbaVerificationData.address;
    }

    if (vbaVerificationData.merchantId && vbaVerificationData.merchantId.length > 0) {
      vbaVerificationData.merchantIds = [];
      // merchant
      for (let i = 0; i < vbaVerificationData.merchantId.length; i++) {
        vbaVerificationData.merchantIds.push({
          merchantId: vbaVerificationData.merchantId[i],
          merchantIdType: vbaVerificationData.merchantIdType[i],
          merchantIdCountry: vbaVerificationData.merchantIdCountry[i],
        });
      }

      delete vbaVerificationData.merchantId;
      delete vbaVerificationData.merchantIdType;
      delete vbaVerificationData.merchantIdCountry;
    }

    const updatedDoc = await VbaRequest.findOneAndUpdate({ walletId, country: 'US' }, { $set: { ...vbaVerificationData, status: 'PENDING' } }, { new: true });
    return !!updatedDoc;
  } catch (error) {
    logger.error(error);
  }
  return false;
}

async function findIdDocByWallet(sessionId, walletId) {
  if (sessionId === undefined || sessionId === null) return null;
  const doc = await VbaRequest.findOne({ walletId, country: 'US' }).catch((err) => { logger.error(err); });
  if (doc && doc._doc && doc._doc.idDoc) {
    const docUri = await documentService.getDocumentUri(sessionId, doc._doc.idDoc);
    return { idDoc: doc._doc.idDoc, docUri };
  }
  return null;
}

async function findCoiDocByWallet(sessionId, walletId) {
  if (sessionId === undefined || sessionId === null) return null;
  const doc = await VbaRequest.findOne({ walletId, country: 'US' }).catch((err) => { logger.error(err); });
  if (doc && doc._doc && doc._doc.coiDoc) {
    const docUri = await documentService.getDocumentUri(sessionId, doc._doc.coiDoc);
    return { coiDoc: doc._doc.coiDoc, docUri };
  }
  return null;
}

async function findMerchantsByWallet(walletId) {
  const doc = await VbaRequest.findOne({ walletId, country: 'US' }).catch((err) => { logger.error(err); });
  if (doc && doc._doc && doc._doc.merchantIds) return doc._doc.merchantIds;
  return null;
}

async function updateIdDocByWallet(sessionId, walletId, idDoc) {
  if (sessionId === undefined || sessionId === null) return null;
  const updatedDoc = await VbaRequest.findOneAndUpdate({ walletId, country: 'US' }, { $set: { idDoc } }, { new: true }).catch((err) => { logger.error(err); });
  if (updatedDoc && updatedDoc._doc && updatedDoc._doc.idDoc) {
    const docUri = await documentService.getDocumentUri(sessionId, updatedDoc._doc.idDoc);
    return { doc: updatedDoc._doc.idDoc, docUri };
  }
  return null;
}

async function updateCoiDocByWallet(sessionId, walletId, coiDoc) {
  if (sessionId === undefined || sessionId === null) return null;
  const updatedDoc = await VbaRequest.findOneAndUpdate({ walletId, country: 'US' }, { $set: { coiDoc } }, { new: true }).catch((err) => { logger.error(err); });
  if (updatedDoc && updatedDoc._doc && updatedDoc._doc.coiDoc) {
    const docUri = await documentService.getDocumentUri(sessionId, updatedDoc._doc.coiDoc);
    return { doc: updatedDoc._doc.coiDoc, docUri };
  }
  return null;
}

async function updateFirstMerchantByWallet(walletId, merchantId) {
  const updatedDoc = await VbaRequest.findOneAndUpdate({ walletId, country: 'US' }, { $set: { 'merchantIds.0.merchantId': merchantId } }, { new: true }).catch((err) => { logger.error(err); });
  if (updatedDoc && updatedDoc._doc && updatedDoc._doc.merchantIds && updatedDoc._doc.merchantIds.length) {
    return updatedDoc._doc.merchantIds[0].merchantId;
  }
  return null;
}

export default {
  getWalletsByAccountId: (sessionId, accountId, limit, offset) => getWalletsByAccountId(sessionId, accountId, limit, offset),
  getWalletById: (sessionId, walletId) => getWalletById(sessionId, walletId),
  getWalletName: (sessionId, walletId) => getWalletName(sessionId, walletId),
  updateNote: (sessionId, walletId, notes) => updateNote(sessionId, walletId, notes),
  searchWallet: (sessionId, keyword, type) => searchWallet(sessionId, keyword, type),
  updateStatus: (sessionId, walletId, status) => updateStatus(sessionId, walletId, status),
  updateVerification: (sessionId, walletId, vbaVerificationData) => updateVerification(sessionId, walletId, vbaVerificationData),
  updateVbaData: (walletId, country, vbaData) => updateVbaData(walletId, country, vbaData),
  saveAuthorizeDoc: (walletId, data, adminAccountId, adminAccountName) => saveAuthorizeDoc(walletId, data, adminAccountId, adminAccountName),
  findAuthorizeDocByWallet: walletId => findAuthorizeDocByWallet(walletId),
  updateVerificationToVbaService: (walletId, vbaVerificationData) => updateVerificationToVbaService(walletId, vbaVerificationData),
  findIdDocByWallet: (sessionId, walletId) => findIdDocByWallet(sessionId, walletId),
  findCoiDocByWallet: (sessionId, walletId) => findCoiDocByWallet(sessionId, walletId),
  updateIdDocByWallet: (sessionId, walletId, idDoc) => updateIdDocByWallet(sessionId, walletId, idDoc),
  updateCoiDocByWallet: (sessionId, walletId, coiDoc) => updateCoiDocByWallet(sessionId, walletId, coiDoc),
  findMerchantsByWallet: walletId => findMerchantsByWallet(walletId),
  updateFirstMerchantByWallet: (walletId, merchantId) => updateFirstMerchantByWallet(walletId, merchantId),
};
