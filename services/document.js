/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import axios from 'axios';
import HttpStatusCode from 'http-status-codes';

import config from '../config';

async function getDocumentUri(sessionId, docId) {
  try {
    const docResponse = await axios.get(`${config.api.prefix}/document/${docId}?sessionId=${sessionId}`);
    if (docResponse && docResponse.status === HttpStatusCode.OK && docResponse.data && docResponse.data.uri) {
      return docResponse.data.uri;
    }
  } catch (error) {
    // let transactions empty
  }
  return null;
}

export default {
  getDocumentUri: (sessionId, docId) => getDocumentUri(sessionId, docId),
};
