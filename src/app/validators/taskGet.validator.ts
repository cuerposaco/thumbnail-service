import * as z from 'zod';

import {
  VALIDATE,
  validateMiddleware,
} from '../../infrastructure/middleware/validate.middleware';
import { isValidObjectId } from 'mongoose';

const TaskGetValidator = z
  .object({
    id: z.string().refine((val) => isValidObjectId(val)),
  })
  .required();

export const taskGetValidator = validateMiddleware(
  TaskGetValidator,
  VALIDATE.PARAMS,
);
