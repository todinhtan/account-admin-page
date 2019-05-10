import mongoose from 'mongoose';

const DailyWithdrawTransferSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'daily_withdraw_transfers',
  },
);

export default mongoose.model('DailyWithdrawTransfer', DailyWithdrawTransferSchema);
