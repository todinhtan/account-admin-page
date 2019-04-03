import mongoose from 'mongoose';

const SynapseUserSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'synapse_users',
  },
);

export default mongoose.model('SynapseUser', SynapseUserSchema);
