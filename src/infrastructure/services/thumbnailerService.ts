import fs from 'fs/promises';
import sharp, { Sharp } from 'sharp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resizeImage = async (input: any, width: number) => {
  return sharp(input).resize({
    width,
    fit: 'contain',
  });
};

export async function thumbnailerServiceByFile(
  imageInput: string,
  width: number,
): Promise<Sharp | undefined> {
  const input = await fs.readFile(imageInput);
  return resizeImage(input, width);
  // Resize the image to the desired width while maintaining the aspect ratio
}

export async function thumbnailerServiceByRemote(
  imageURI: string,
  width: number,
): Promise<Sharp | undefined> {
  // Fetch the image from the remote URL
  const response = await fetch(imageURI);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Resize the image to the desired width while maintaining the aspect ratio
  return resizeImage(buffer, width);
}
