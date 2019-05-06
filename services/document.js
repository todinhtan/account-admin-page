/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';
import logger from '../utils/logger';

async function getDocumentUri(sessionId, docId) {
  try {
    if (docId.startsWith('http')) return docId;
    const docResponse = await axios.get(`${config.api.prefix}/document/${docId}?sessionId=${sessionId}`);
    if (docResponse && docResponse.status === HttpStatusCode.OK && docResponse.data && docResponse.data.uri) {
      return docResponse.data.uri;
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
}

export default {
  getDocumentUri: (sessionId, docId) => getDocumentUri(sessionId, docId),
};
