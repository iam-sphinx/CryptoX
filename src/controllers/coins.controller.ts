import { matchedData, validationResult } from 'express-validator';
import { Coin } from '../schemas/coins.schema';
import { ApiError } from '../utils/apiError.util';
import { asyncHandler } from '../utils/asynchandler.util';
import { fetchCoinData } from '../utils/fetchCoinData.util';

// Route : /stats
// Method : GET
export const getCoinsData = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  const data = matchedData(req);

  if (!result.isEmpty()) {
    throw new ApiError(400, result.array().at(0)?.msg);
  }

  const { coin } = data;
  const { market_cap, current_price, id, price_change_24h } =
    await fetchCoinData(coin);

  const updatedCoinData = await Coin.findOneAndUpdate(
    { name: id },
    {
      marketCap: market_cap,
      price: current_price,
      change24h: price_change_24h,
    },
    { new: true, upsert: true },
  );

  const { price, marketCap, change24h } = updatedCoinData;
  const response = {
    price,
    marketCap,
    '24hChange': change24h,
  };

  res.status(200).json(response);
});
