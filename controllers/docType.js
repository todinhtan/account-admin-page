/* eslint-disable import/prefer-default-export */
import services from '../services';

export async function create(req, res) {
  try {
    const success = await services.docTypeService.create(req.body);
    if (success) req.session.messages = ['Submitted successfully'];
    else req.session.errors = ['Failed'];
  } catch (error) {
    // let accounts empty
  }
  res.redirect(req.header('Referer'));
}
