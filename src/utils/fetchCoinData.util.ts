import { envMapping } from '../config/envMapping';
import { ApiError } from './apiError.util';

export const fetchCoinData = async (coin: string) => {
  const coingeckoURI = `${envMapping.COINGECKO_BASE_URI}/coins/markets?vs_currency=usd&ids=${coin}`;

  const response = await fetch(coingeckoURI, {
    headers: { 'x-cg-pro-api-key': envMapping.COINGECKO_KEY! },
  });

  if (!response.ok) {
    throw new ApiError(
      400,
      `Failed to get ${coin} info: ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data[0];
};
