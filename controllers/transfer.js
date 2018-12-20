/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';
import config from '../config';

export async function getTransfersBySRNAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * config.api.pageSize;
    let listTransfer = {};
    let friendlyNames = {};
    try {
      listTransfer = await services.transferService.getTransfersBySRN(req.session.sessionId, req.params.srn, config.api.pageSize, offset);
      // get friendly name of SRN
      for (const tr of listTransfer.items) {
        friendlyNames = await services.commonService.storeSrnFriendlyName(tr.source, friendlyNames, req.session.sessionId);
        friendlyNames = await services.commonService.storeSrnFriendlyName(tr.dest, friendlyNames, req.session.sessionId);
      }
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/transfers', {
      listTransfer, friendlyNames,
    });
  }
}

export async function getTransferById(req, res) {
  const transfer = await services.transferService.getTransferById(req.session.sessionId, req.query.tid);
  let friendlyNames = {};
  if (transfer != null) {
    friendlyNames = await services.commonService.storeSrnFriendlyName(transfer.source, friendlyNames, req.session.sessionId);
    friendlyNames = await services.commonService.storeSrnFriendlyName(transfer.dest, friendlyNames, req.session.sessionId);
  }
  res.render('pages/transfer_search', {
    transfer,
    friendlyNames,
    tid: req.query.tid,
  });
}
