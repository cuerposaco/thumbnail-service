import { RequestHandler } from 'express';
import HttpStatus from 'http-status';
import {
  addImageToTask,
  // addImageToTask,
  createTask as createTaskDomain,
  getTaskById as getTaskByIdDomain,
  setAsCompleted,
  setAsFailed,
} from '../domain/tasks';
import logger from '../../infrastructure/logger';
import { createThumbnails as createThumbnailsController } from './thumbnail';
import AppError from '../../infrastructure/errorhandler/appError';

export const createTask: RequestHandler = async (req, res, next) => {
  const { imagePath, imageUri } = req.body || {};
  if (!(imagePath || imageUri)) {
    next(
      new AppError(
        HttpStatus.BAD_REQUEST,
        'imagePath or imageUri are required',
      ),
    );
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, ...createdTask } = await createTaskDomain(
      imagePath || imageUri,
    );
    res.status(HttpStatus.CREATED).json(createdTask);
    const { taskId } = createdTask;

    createThumbnailsController(taskId, imagePath ? 'LOCAL' : 'REMOTE')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(async (images: any) =>
        Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          images.map(async (imageModel: any) =>
            addImageToTask(String(taskId), String(imageModel._id)),
          ),
        ),
      )
      .then(async () => {
        await setAsCompleted(taskId);
        logger.info(`thumbnails created successfully for task: ${taskId}`);
      })
      .catch(async () => {
        await setAsFailed(taskId);
        logger.error(`Error creating thumbnails for task ${taskId}`);
      });
  } catch (error) {
    next(error);
  }
};

export const getTaskById: RequestHandler = async (req, res, next) => {
  try {
    logger.info(`getTaskById ${req.params.id}`);
    const task = await getTaskByIdDomain(req.params.id);
    if (task.images && !task.images.length) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { images, ...foundTask } = task;
      res.status(HttpStatus.OK).json(foundTask);
      return;
    }
    res.status(HttpStatus.OK).json(task);
  } catch (error) {
    next(error);
  }
};
