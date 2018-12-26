
import { Router } from 'express';
import {
  getIndex, getLogin, postLogin, logout, updatePagesize,
} from '../controllers';
import { verifySession } from '../middlewares';

const router = Router();


router.get('/', verifySession, getIndex);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

router.post('/pagesize/update', verifySession, updatePagesize);

export default router;
