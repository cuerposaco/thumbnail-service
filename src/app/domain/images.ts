import { ImageModel } from '../models/ImagesModel';

export const createImageThumbnail = async ({
  resolution,
  path,
}: {
  resolution: string;
  path: string;
}) => {
  const imageThumbnail = {
    resolution,
    path,
  };

  return await ImageModel.create(imageThumbnail);
};
