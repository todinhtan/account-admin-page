import { Router } from 'express';
import { getTransfersBySRNAjax, getTransferById } from '../controllers/transfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/transfers/:srn/ajax', verifySession, getTransfersBySRNAjax);

// search
router.get('/transfers/search', verifySession, getTransferById);

export default router;
