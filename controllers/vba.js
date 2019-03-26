/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import services from '../services';

export async function getUnauthorizedVbas(req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;
  const offset = (page - 1) * 50;
  let listUnauthorizedVba = {};
  try {
    listUnauthorizedVba = await services.vbaService.getUnauthorizedVba(50, offset);
  } catch (error) {
    // let accounts empty
  }
  res.render('pages/unauthorizedVba', { listUnauthorizedVba });
}

export async function getUnauthorizedVbasAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    const offset = (page - 1) * 50;
    let listUnauthorizedVba = {};
    try {
      listUnauthorizedVba = await services.vbaService.getUnauthorizedVba(50, offset);
    } catch (error) {
      // let accounts empty
    }
    res.render('ajax/unauthorizedVba', { listUnauthorizedVba });
  }
}

export async function getDocumentUriAjax(req, res) {
  if (!req.xhr) res.send(null);
  else {
    let docUri = '';
    const { idDoc } = req.body;
    try {
      docUri = await services.documentService.getDocumentUri(req.session.sessionId, idDoc);
    } catch (error) {
      // let accounts empty
    }
    res.send(docUri);
  }
}
