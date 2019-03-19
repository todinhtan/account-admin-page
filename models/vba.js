import mongoose from 'mongoose';

const VbaSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'vbarequests',
  },
);

export default mongoose.model('VbaRequest', VbaSchema);
