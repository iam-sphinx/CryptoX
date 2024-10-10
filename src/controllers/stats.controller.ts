import { matchedData, validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asynchandler.util';
import { ApiError } from '../utils/apiError.util';
import { Coin } from '../schemas/coins.schema';
import { CoinLog } from '../schemas/coinLog.schema';

export const getDeviation = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  const { coin } = matchedData(req);

  if (!result.isEmpty()) {
    throw new ApiError(400, result.array().at(0)?.msg);
  }

  const coinData = await Coin.findOne({ name: coin });
  if (!coinData) {
    throw new ApiError(404, 'coin not exist');
  }

  const records = await CoinLog.find({ coinRef: coinData._id })
    .sort({ timestamp: -1 })
    .limit(100);
  const prices = records.map((record) => record.price);
  if (prices.length < 2) {
    throw new ApiError(400, 'Not enough data to calculate deviation');
  }

  const mean = prices.reduce((sum, price) => sum + price, 0);
  const variance = prices.reduce(
    (sum, price) => sum + Math.pow(price - mean, 2),
    0,
  );

  const deviation = Math.sqrt(variance).toFixed(2);
  await Coin.findByIdAndUpdate(coinData._id, { deviation });

  res.json({ deviation });
});
