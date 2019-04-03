import { Router } from 'express';
import {
  getQueuedSynapseUsers,
  getQueuedSynapseUsersAjax,
  getSynapseUserByIdAjax,
} from '../controllers/synapseUser';
import { verifySession } from '../middlewares';

const router = Router();

router.get('/synapse/users', verifySession, getQueuedSynapseUsers);

// ajax
router.get('/synapse/users/ajax', verifySession, getQueuedSynapseUsersAjax);
router.get('/synapse/user/:userId', verifySession, getSynapseUserByIdAjax);

export default router;
