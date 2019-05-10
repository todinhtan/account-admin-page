import mongoose from 'mongoose';

const PreprocessingWithdrawTransferSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'PENDING',
    },
  },
  {
    strict: false,
    collection: 'preprocessing_withdraw_transfers',
  },
);

export default mongoose.model('PreprocessingWithdrawTransfer', PreprocessingWithdrawTransferSchema);
