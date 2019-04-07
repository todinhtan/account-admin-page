import { Router } from 'express';
import {
  getQueuedSynapseUsers,
  getQueuedSynapseUsersAjax,
  getSynapseUserByIdAjax,
  getVbaByWalletIdAjax,
} from '../controllers/synapseUser';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/synapse/users', verifySession, getQueuedSynapseUsers);

// ajax
router.get('/synapse/users/ajax', verifySession, getQueuedSynapseUsersAjax);
router.get('/synapse/user/:userId', verifySession, getSynapseUserByIdAjax);
router.get('/vba/wallet/:walletId/pinyin', verifySession, getVbaByWalletIdAjax);

export default router;
