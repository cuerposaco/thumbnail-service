import { RequestHandler } from 'express';
import {
  createTask as createTaskDomain,
  getTaskById as getTaskByIdDomain,
} from '../domain/tasks';
import logger from '../../infrastructure/logger';

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, ...createdTask } = await createTaskDomain();
    res.status(200).json(createdTask);
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
      res.status(200).json(foundTask);
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
