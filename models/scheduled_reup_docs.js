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
        values: ['authorization', 'idDoc', 'coiDoc', 'amz', 'basic', 'company_basic'],
      },
      required: true,
    },
    authorizationData: {
      fullName: {
        type: String,
        trim: true,
      },
      sex: {
        type: String,
        enum: {
          values: ['CORP', 'M', 'F'],
        },
      },
      ethnicity: {
        type: String,
        trim: true,
      },
      dobString: {
        type: String,
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
      adminAccountId: {
        type: String,
        trim: true,
      },
      adminAccountName: {
        type: String,
        trim: true,
      },
      idDoc: {
        type: String,
        trim: true,
      },
    },
    userData: {
      email: {
        type: String,
        trim: true,
      },
      phone_number: {
        type: String,
        trim: true,
      },
      ip: {
        type: String,
        trim: true,
      },
      address_street: {
        type: String,
        trim: true,
      },
      address_city: {
        type: String,
        trim: true,
      },
      address_subdivision: {
        type: String,
        trim: true,
      },
      address_postal_code: {
        type: String,
        trim: true,
      },
      address_country_code: {
        type: String,
        trim: true,
      },
      day: {
        type: Number,
        trim: true,
      },
      month: {
        type: Number,
        trim: true,
      },
      year: {
        type: Number,
        trim: true,
      },
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
