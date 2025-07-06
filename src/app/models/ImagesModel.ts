import mongoose, { Schema, Document } from 'mongoose';

interface IImage extends Document {
  images: Array<{
    resolution: string;
    path: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema: Schema = new Schema(
  {
    resolution: { type: String },
    path: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const ImageModel = mongoose.model<IImage>('images', ImageSchema);
export { ImageModel, IImage };
