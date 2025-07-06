import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

interface ITask extends Document {
  status: string;
  price: number;
  originalPath: string;
  images?: Array<{
    resolution: string;
    path: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: TaskStatus,
      required: true,
    },
    price: { type: Number, required: true },
    originalPath: { type: String, required: true },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'images',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const TaskModel = mongoose.model<ITask>('tasks', TaskSchema);
export { TaskModel, ITask };
