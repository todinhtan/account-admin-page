import { Router } from 'express';
import { getTransactionsBySRNAjax, getTransactionById } from '../controllers/transaction';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/transactions/:srn/ajax', verifySession, getTransactionsBySRNAjax);

// search
router.get('/transactions/search', verifySession, getTransactionById);

export default router;
