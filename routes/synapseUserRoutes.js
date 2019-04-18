import { Router } from 'express';
import {
  getQueuedSynapseUsers,
  getQueuedSynapseUsersAjax,
  getSynapseUserByIdAjax,
  getVbaByWalletIdAjax,
  insertDeactiveNode,
  insertLockUser,
} from '../controllers/synapseUser';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/synapse/users', verifySession, getQueuedSynapseUsers);

// ajax
router.get('/synapse/users/ajax', verifySession, getQueuedSynapseUsersAjax);
router.get('/synapse/user/:userId', verifySession, getSynapseUserByIdAjax);
router.get('/vba/wallet/:walletId/pinyin', verifySession, getVbaByWalletIdAjax);

router.get('/synapse/user/:userId/deactiveNode', verifySession, insertDeactiveNode);
router.get('/synapse/user/:userId/lockUser', verifySession, insertLockUser);

export default router;
