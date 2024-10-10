import { Schema, Model, model } from 'mongoose';

const CoinLogSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    coinRef: {
      type: Schema.Types.ObjectId,
      ref: 'coin',
    },
  },
  { timestamps: true },
);

export const CoinLog = model('coinLog', CoinLogSchema);
