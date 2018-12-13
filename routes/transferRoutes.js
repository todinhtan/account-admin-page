import { Router } from 'express';
import { getTransfersBySRNAjax } from '../controllers/transfer';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/transfers/:srn/ajax', verifySession, getTransfersBySRNAjax);

export default router;
