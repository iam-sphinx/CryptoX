import { Router } from 'express';
import { query } from 'express-validator';
import { validCoins } from '../utils/validCoins';
import { getDeviation } from '../controllers/stats.controller';

const router = Router();

router.get(
  '/',
  query('coin').trim().notEmpty().escape().isIn(validCoins),
  getDeviation,
);

export default router;
