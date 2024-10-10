import { Schema, model } from 'mongoose';

const CoinSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    change24h: {
      type: Number,
      required: true,
    },
    deviation: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
);

export const Coin = model('coin', CoinSchema);
