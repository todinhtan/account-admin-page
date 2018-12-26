import { Router } from 'express';
import { getTransfersBySRNAjax, getTransferById, addFunds } from '../controllers/transfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/transfers/:srn/ajax', verifySession, getTransfersBySRNAjax);

// search
router.get('/transfers/search', verifySession, getTransferById);

// fund
router.post('/funds/add', verifySession, addFunds);

export default router;
