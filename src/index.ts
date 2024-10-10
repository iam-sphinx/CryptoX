import dotenv from 'dotenv';
// to configure environment variables into project
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import { connectDB } from './db/connect';
import { fetchCoinDataJob } from './job/coins.job';
import Logging from './library/logging';
import { ApiError } from './utils/apiError.util';
import { envMapping } from './config/envMapping';

// Routes import
import coinInfoRoutes from './routes/coins.routes';
import coinStatsRoutes from './routes/stats.routes';
// base app
const app = express();

// cron job
fetchCoinDataJob().start();

// routes
app.use('/stats', coinInfoRoutes);
app.use('/deviation', coinStatsRoutes);

// health route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'CryptoX server is healthy!' });
});

// Error handling
app.use(
  (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;

    // Log the error for monitoring
    Logging.error(err);

    const response = {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Only show stack in development
    };

    res.status(statusCode).json(response);
  },
);

// server run after db connection
connectDB().then(() => {
  app.listen(envMapping.PORT, () => {
    Logging.info(`server is running fine on port ${envMapping.PORT}`);
  });
});
