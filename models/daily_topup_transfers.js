import mongoose from 'mongoose';

const DailyTopupTransferSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'daily_topup_transfers',
  },
);

export default mongoose.model('DailyTopupTransfer', DailyTopupTransferSchema);
