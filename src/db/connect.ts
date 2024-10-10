import mongoose from 'mongoose';
import Logging from '../library/logging';
import { envMapping } from '../config/envMapping';

export const connectDB = async () => {
  try {
    const url = envMapping.MONGO_URI;
    if (!url) {
      throw new Error('mongo db url not found');
    }
    const dbInfo = await mongoose.connect(url);
    Logging.info(`mongodb connected at host : ${dbInfo.connection.host}`);
  } catch (error) {
    Logging.error(error);
    process.exit(1);
  }
};
