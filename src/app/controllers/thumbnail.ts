import path from 'node:path';
import { mkdir } from 'fs/promises';
import crypto from 'crypto';
import HttpStatus from 'http-status';
import {
  thumbnailerServiceByFile,
  thumbnailerServiceByRemote,
} from '../../infrastructure/services/thumbnailerService';
import { ITask, TaskModel } from '../models/TaskModel';
import { createImageThumbnail } from '../domain/images';
import AppError from '../../infrastructure/errorhandler/appError';

const SIZES = [800, 1024];

const FILE_PATTERN = `output/{name}/{size}/{md5}{ext}`;
const parseFileOutput = (
  filePattern = '',
  data: Record<string, string> = {},
) => {
  const replacementPattern = /{\s*(\w+?)\s*}/g;
  return filePattern.replace(
    replacementPattern,
    (_, token) => data[token] || '',
  );
};

interface ThumbnailResults {
  fileOutput: string;
  size: number;
}

export const createHash = (str: string) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

export const createThumbnails = async (
  taskId: string,
  location: 'LOCAL' | 'REMOTE',
) => {
  const task: ITask | null = await TaskModel.findById(taskId);
  if (!task) throw new AppError(HttpStatus.NOT_FOUND, 'Task not found');

  const { originalPath } = task;
  if (!originalPath)
    throw new AppError(HttpStatus.NOT_FOUND, 'Original path not found');

  const { name, ext } = path.parse(originalPath);

  const executeFn =
    location === 'LOCAL'
      ? thumbnailerServiceByFile
      : thumbnailerServiceByRemote;

  const thumbnails: Promise<ThumbnailResults>[] = SIZES.map((size) =>
    executeFn(task.originalPath, size).then(async (result) => {
      const fileOutput = parseFileOutput(FILE_PATTERN, {
        name,
        size: String(size),
        md5: createHash(task.originalPath + new Date(Date.now()).toISOString()),
        ext,
      });

      // create directories
      const { dir } = path.parse(fileOutput);
      await mkdir(dir, { recursive: true });
      // create file
      result?.toFile(fileOutput);
      // response
      return { fileOutput, size };
    }),
  );

  const _thumbnails = await Promise.all(thumbnails);

  return Promise.all(
    _thumbnails.map(({ fileOutput, size }) =>
      createImageThumbnail({ resolution: String(size), path: fileOutput }),
    ),
  );
};
