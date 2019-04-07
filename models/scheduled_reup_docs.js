import mongoose from 'mongoose';

const ScheduledReupDocSchema = new mongoose.Schema(
  {
    walletId: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    docType: {
      type: String,
      enum: {
        values: ['authorization', 'idDoc', 'coiDoc', 'amz'],
      },
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
    timestamps: { createdAt: 'created_time', updatedAt: 'updated_time' },
    collection: 'scheduled_reup_docs',
  },
);

export default mongoose.model('ScheduledReupDoc', ScheduledReupDocSchema);
