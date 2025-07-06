import mongoose from 'mongoose';
import logger from '../logger/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function connect(MONGO_URI: string, connectionOptions: any) {
  try {
    logger.info('Connecting to db', MONGO_URI);
    await mongoose.connect(MONGO_URI, connectionOptions);
    logger.info('DB connected');
  } catch (error) {
    logger.warn('Could not connect to db', MONGO_URI, error);
    throw new Error('Could not connect to db');
  }
}
