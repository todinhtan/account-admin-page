import { Router } from 'express';
import { getTransactionsBySRNAjax } from '../controllers/transaction';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/transactions/:srn/ajax', verifySession, getTransactionsBySRNAjax);

export default router;
