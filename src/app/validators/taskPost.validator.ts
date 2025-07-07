import * as z from 'zod';

import {
  VALIDATE,
  validateMiddleware,
} from '../../infrastructure/middleware/validate.middleware';

const TaskPostValidator = z
  .object({
    imagePath: z.optional(
      z
        .string()
        .url({ message: 'Use "imagePath" to create a task from local file' }),
    ),
    imageUri: z.optional(
      z
        .string()
        .url({ message: 'Use "imageUri" to create a task from remote file' }),
    ),
  })
  .refine((schema) => {
    return !(
      (schema.imagePath === undefined && schema.imageUri === undefined) ||
      (schema.imagePath !== undefined && schema.imageUri !== undefined)
    );
  }, 'imagePath and imageUri cannot be used together');

export const taskPostValidator = validateMiddleware(
  TaskPostValidator,
  VALIDATE.BODY,
);
