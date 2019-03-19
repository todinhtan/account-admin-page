import mongoose from 'mongoose';

const AuthorizeDocSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    sex: {
      type: String,
      enum: {
        values: ['M', 'F'],
      },
      required: true,
    },
    ethnicity: {
      type: String,
      trim: true,
    },
    dob: {
      type: Number,
    },
    address: {
      street1: {
        type: String,
        trim: true,
      },
      street2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    citizenIdNumber: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'PENDING',
    },
    adminAccountId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_time', updatedAt: 'updated_time' },
    strict: false,
    collection: 'authorization_docs',
  },
);

AuthorizeDocSchema.index({ walletId: 1 });
export default mongoose.model('AuthorizeDoc', AuthorizeDocSchema);
