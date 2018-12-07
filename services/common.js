/* eslint-disable max-len */
import accountService from './account';
import walletService from './wallet';

async function storeSrnFriendlyName(srn, friendlyNames, sessionId) {
  const fns = { ...friendlyNames };
  const [type, id] = srn.split(':');
  if (!(srn in friendlyNames)) {
    fns[srn] = {};
    switch (type) {
      case 'account':
        fns[srn].name = await accountService.getAccountName(sessionId, id);
        fns[srn].url = `/account/${id}`;
        break;
      case 'wallet':
        fns[srn].name = await walletService.getWalletName(sessionId, id);
        fns[srn].url = `/wallet/${id}`;
        break;
      default:
        fns[srn].name = id;
        fns[srn].url = '#';
        break;
    }
  }
  return fns;
}

export default {
  storeSrnFriendlyName: (srn, friendlyNames, sessionId) => storeSrnFriendlyName(srn, friendlyNames, sessionId),
};
