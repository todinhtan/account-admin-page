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
