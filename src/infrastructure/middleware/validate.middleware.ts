import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { z } from 'zod';

import AppError from '../../infrastructure/errorhandler/appError';
import logger from '../logger';

export enum VALIDATE {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}

export const validateMiddleware =
  (validator: z.ZodSchema, validate: VALIDATE) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Validating ${validate}...`);
      console.log(req[validate]);
      validator.parse(req[validate]);
      next();
    } catch (error: z.ZodError | unknown) {
      const appError = new AppError(
        error instanceof z.ZodError
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR,
        error instanceof z.ZodError
          ? `invalid ${validate} params`
          : 'internal server error',
        error instanceof z.ZodError ? error.issues : undefined,
      );
      next(appError);
    }
  };
