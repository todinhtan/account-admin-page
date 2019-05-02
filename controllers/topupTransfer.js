/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import services from '../services';

export async function getQueuedTopupTransfers(req, res) {
  let listTransfers = {};
  try {
    listTransfers = await services.topupTransfer.getQueuedTopupTransfers();
  } catch (error) {
    // let accounts empty
  }
  res.render('pages/topupTranfers', { listTransfers });
}

export async function createTopupTransfer(req, res) {
  const newTransfer = await services.topupTransfer.createTopupTransfer(req.session.sessionId, req.body);
  if (newTransfer) {
    req.session.messages = [`Created transfer ${newTransfer.id} successfully`];
    await services.topupTransfer.markDoneTopupTransfer(newTransfer.id, req.body.wyreTransferId);
  } else req.session.errors = ['Created transfer failed'];

  res.redirect(req.header('Referer'));
}

export async function updateTopupTransfer(req, res) {
  const isSuccess = await services.topupTransfer.editTopupTransfer(req.body);
  if (isSuccess) req.session.messages = [`Updated transfer ${req.body.wyreTransferId} successfully`];
  else req.session.errors = [`Update transfer ${req.body.wyreTransferId} failed`];

  res.redirect(req.header('Referer'));
}

export async function bulkCreateTransfers(req, res) {
  const { wyreTransferIds } = req.body;
  const successIds = await services.topupTransfer.bulkCreateTransfers(req.session.sessionId, wyreTransferIds);
  if (successIds && successIds.length) req.session.messages = successIds.map(t => `Updated transfer ${t} successfully`);
  else req.session.errors = ['Failed to create selected transfers'];

  res.redirect(req.header('Referer'));
}
