/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';
import { mkdir } from 'fs/promises';
import crypto from 'crypto';
import {
  thumbnailerServiceByFile,
  thumbnailerServiceByRemote,
} from '../../infrastructure/services/thumbnailerService';
import { TaskModel } from '../models/TaskModel';
import { createImageThumbnail } from '../domain/images';

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

export const createHash = (str: string) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

export const createThumbnails = async (
  taskId: string,
  location: 'LOCAL' | 'REMOTE',
) => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new Error('Task not found');

  const { originalPath } = task;
  if (!originalPath) throw new Error('Original path not found');

  const { name, ext } = path.parse(originalPath);

  const executeFn =
    location === 'LOCAL'
      ? thumbnailerServiceByFile
      : thumbnailerServiceByRemote;

  const thumbnails = SIZES.map((size) =>
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

  const _thumbnails = (await Promise.all(thumbnails)) as any[];

  return Promise.all(
    _thumbnails.map(({ fileOutput, size }: any) =>
      createImageThumbnail({ resolution: size, path: fileOutput }),
    ),
  );
};
