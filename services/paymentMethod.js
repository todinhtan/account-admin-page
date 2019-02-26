/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function getPaymentMethodsByAccount(sessionId, accountId, limit, offset) {
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
    const methodsResponse = await axios.get(`${config.api.prefix}/paymentMethods?accountId=${accountId}&sessionId=${sessionId}&limit=${l}&offset=${o}`);
    if (methodsResponse && methodsResponse.status === HttpStatusCode.OK && methodsResponse.data) {
      result.items = methodsResponse.data.data;
      result.total = methodsResponse.data.recordsTotal;
    }
  } catch (error) {
    // let transactions empty
  }

  result.totalPage = Math.ceil(result.total / limit);

  return result;
}

async function getPaymentMethodById(sessionId, methodId) {
  try {
    if (sessionId === undefined || sessionId === null) return null;
    if (methodId === undefined || methodId === null) return null;
    const response = await axios.get(`${config.api.prefix}/paymentMethod/${methodId}?sessionId=${sessionId}`);
    if (response && response.status === HttpStatusCode.OK && response.data) return response.data;
  } catch (error) {
    // just return false
  }
  return null;
}

export default {
  getPaymentMethodsByAccount: (sessionId, accountId, limit, offset) => getPaymentMethodsByAccount(sessionId, accountId, limit, offset),
  getPaymentMethodById: (sessionId, methodId) => getPaymentMethodById(sessionId, methodId),
};
