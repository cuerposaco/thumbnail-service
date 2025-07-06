import { TaskModel, TaskStatus } from '../models/TaskModel';
import { Types } from 'mongoose';

const getPrice = ({
  min = 5,
  max = 50,
}: { min?: number; max?: number } = {}) => {
  const random = Math.random() * (max - min) + min;
  const toFixed = random.toFixed(1);
  return Number(toFixed);
};

export const createTask = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const task: any = {
    status: TaskStatus.PENDING,
    price: getPrice(),
    originalPath: 'fake/path.jpg',
  };

  const createdTask = await TaskModel.create(task);
  return await getTaskById(String(createdTask._id));
};

export const getTaskById = async (id: string) => {
  const [task] = await TaskModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: 'images',
        foreignField: '_id',
        as: 'images',
      },
    },
    {
      $project: {
        _id: 0,
        taskId: '$_id',
        status: 1,
        price: 1,
        'images.resolution': 1,
        'images.path': 1,
      },
    },
  ]);

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

export const addImageToTask = async (taskId: string, imageId: string) => {
  const updatedTask = await TaskModel.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId) },
    { $push: { images: new Types.ObjectId(imageId) } },
    { new: true },
  );

  return updatedTask;
};
