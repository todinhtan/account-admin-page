import { Router } from 'express';
import webRoutes from './webRoutes';
import accountRoutes from './accountRoutes';
import walletRoutes from './walletRoutes';
import transferRoutes from './transferRoutes';
import transactionRoutes from './transactionRoutes';
import paymentMethodRoutes from './paymentMethodRoutes';
import vbaRoutes from './vbaRoutes';
import synapseUserRoutes from './synapseUserRoutes';
import docTypeRoutes from './docType';
import topupTransferRoutes from './topupTransferRoutes';
import withdrawTransferRoutes from './withdrawTransferRoutes';

const router = Router();

router.use('/', webRoutes)
  .use('/', accountRoutes)
  .use('/', walletRoutes)
  .use('/', transferRoutes)
  .use('/', transactionRoutes)
  .use('/', paymentMethodRoutes)
  .use('/', vbaRoutes)
  .use('/', synapseUserRoutes)
  .use('/', docTypeRoutes)
  .use('/', topupTransferRoutes)
  .use('/', withdrawTransferRoutes);

export default router;
