import { CronJob } from 'cron';
import Logging from '../library/logging';
import { CoinLog } from '../schemas/coinLog.schema';
import { Coin } from '../schemas/coins.schema';
import { fetchCoinData } from '../utils/fetchCoinData.util';
import { validCoins } from '../utils/validCoins';

export const fetchCoinDataJob = (): CronJob => {
  const job = new CronJob(
    '0 */2 * * *', // cronTime
    async () => {
      try {
        const results = await Promise.all(validCoins.map(fetchCoinData));

        for (const {
          id,
          current_price,
          market_cap,
          price_change_24h,
        } of results) {
          const coinData = await Coin.findOne({ name: id });

          // Create or update the coin entry
          if (!coinData) {
            const newCoin = new Coin({
              name: id,
              price: current_price,
              marketCap: market_cap,
              change24h: price_change_24h,
            });
            await newCoin.save();

            // Log the new coin entry
            const newLog = new CoinLog({
              coinRef: newCoin._id,
              price: current_price,
              marketCap: market_cap,
            });
            await newLog.save();
          } else {
            // Log the existing coin entry
            const newLog = new CoinLog({
              coinRef: coinData._id,
              price: current_price,
              marketCap: market_cap,
            });
            await newLog.save();
          }
        }
      } catch (error: any) {
        Logging.error(`Error fetching coin data: ${error.message}`);
      }
    },
  );

  return job;
};
