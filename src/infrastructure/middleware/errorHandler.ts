import { NextFunction, Request, Response } from 'express';
import AppError from '../errorhandler/appError';
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

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...((err.data && { data: err.data }) || {}),
    });
    return;
  }

  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
}
