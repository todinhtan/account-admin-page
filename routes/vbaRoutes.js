import { Router } from 'express';
import {
  getUnauthorizedVbas,
  getUnauthorizedVbasAjax,
  getDocumentUriAjax,
  getVbaByWalletIdAjax,
} from '../controllers/vba';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/vba/unauthorized', verifySession, getUnauthorizedVbas);

// ajax
router.get('/vba/unauthorized/ajax', verifySession, getUnauthorizedVbasAjax);
router.post('/idDoc/ajax', verifySession, getDocumentUriAjax);
router.get('/wallet/:walletId/vba/ajax', verifySession, getVbaByWalletIdAjax);

export default router;
