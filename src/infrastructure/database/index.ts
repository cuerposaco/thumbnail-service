import mongoose from 'mongoose';
import HttpStatus from 'http-status';

import logger from '../logger/index';
import AppError from '../errorhandler/appError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function connect(MONGO_URI: string, connectionOptions: any) {
  try {
    logger.info('Connecting to db');
    await mongoose.connect(MONGO_URI, connectionOptions);
    logger.info('DB connected');
  } catch (error) {
    logger.warn('Could not connect to db', error);
    throw new AppError(
      HttpStatus.SERVICE_UNAVAILABLE,
      'Could not connect to db',
    );
  }
}
