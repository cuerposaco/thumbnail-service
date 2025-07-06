import sharp, { Sharp } from 'sharp';
import fs from 'fs';

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
  const input = fs.readFileSync(imageInput);
  // Resize the image to the desired width while maintaining the aspect ratio
  return resizeImage(input, width);
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
