import { Router } from 'express';
import { getCoinsData } from '../controllers/coins.controller';
import { query } from 'express-validator';
import { validCoins } from '../utils/validCoins';

const router = Router();

router.get(
  '/',
  query('coin')
    .trim()
    .notEmpty()
    .escape()
    .isIn(validCoins)
    .withMessage(`Coin must be one of: ${validCoins.join(', ')}`),
  getCoinsData,
);

export default router;
