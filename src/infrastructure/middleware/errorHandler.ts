import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
}
