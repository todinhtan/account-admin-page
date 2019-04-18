import mongoose from 'mongoose';

const LockUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'DONE'],
      },
      default: 'PENDING',
    },
  },
  {
    strict: false,
    collection: 'lock_users',
  },
);

export default mongoose.model('LockUser', LockUserSchema);
