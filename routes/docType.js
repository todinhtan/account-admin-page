import { Router } from 'express';
import {
  create,
} from '../controllers/docType';
import { verifySession } from '../middlewares';

const router = Router();

router.post('/docType/create', verifySession, create);

export default router;
