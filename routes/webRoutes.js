
import { Router } from 'express';
import {
  getIndex, getLogin, postLogin, logout,
} from '../controllers';
import { verifySession } from '../middlewares';

const router = Router();


router.get('/', verifySession, getIndex);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

export default router;
