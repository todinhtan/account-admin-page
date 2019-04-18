import mongoose from 'mongoose';

const DeactiveNodeSchema = new mongoose.Schema(
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
    collection: 'deactive_nodes',
  },
);

export default mongoose.model('DeactiveNode', DeactiveNodeSchema);
