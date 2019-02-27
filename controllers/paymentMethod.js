/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import services from '../services';

export async function getPaymentMethodDetail(req, res) {
  const method = await services.paymentMethodService.getPaymentMethodById(req.session.sessionId, req.params.methodId);
  res.render('pages/paymentMethod', {
    method,
  });
}
