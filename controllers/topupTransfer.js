/* eslint-disable import/prefer-default-export */
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
