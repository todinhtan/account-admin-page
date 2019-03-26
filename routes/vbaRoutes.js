import { Router } from 'express';
import {
  getUnauthorizedVbas,
  getUnauthorizedVbasAjax,
  getDocumentUriAjax,
} from '../controllers/vba';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/vba/unauthorized', verifySession, getUnauthorizedVbas);

// ajax
router.get('/vba/unauthorized/ajax', verifySession, getUnauthorizedVbasAjax);
router.post('/idDoc/ajax', verifySession, getDocumentUriAjax);

export default router;
