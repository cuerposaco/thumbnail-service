import { unlink } from 'fs/promises';
import { Server } from 'http';

import sharp from 'sharp';
import express from 'express';

import {
  thumbnailerServiceByFile,
  thumbnailerServiceByRemote,
} from '../../infrastructure/services/thumbnailerService';

describe('ThumbnailerService', () => {
  describe('thumbnailerServiceByFile', () => {
    it('should create file', async () => {
      const SIZE = 250;
      const INPUT = 'output/2000x1000_image-test.jpg';
      const OUTPUT = 'output/output.png';

      const transformer = await thumbnailerServiceByFile(INPUT, SIZE);
      expect(transformer).toBeDefined();

      if (transformer) {
        await transformer.toFile(OUTPUT);
        const { width } = await sharp(OUTPUT).metadata();
        expect(width).toBe(SIZE);
      }

      await unlink(OUTPUT);
    });

    it('should fail if file not exists', async () => {
      const SIZE = 250;
      const INPUT = 'output/fail.png';

      try {
        await thumbnailerServiceByFile(INPUT, SIZE);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('thumbnailerServiceByRemote', () => {
    let server: Server;

    beforeEach((next) => {
      const app = express();
      app.use('/output', express.static('output'));
      server = app.listen(8888, next);
    });

    afterEach(async () => {
      await server.close();
    });

    it('should create file', async () => {
      const SIZE = 250;
      const INPUT = 'http://localhost:8888/output/2000x1000_image-test.jpg';
      const OUTPUT = 'output/output_remote.png';

      const transformer = await thumbnailerServiceByRemote(INPUT, SIZE);
      expect(transformer).toBeDefined();

      if (transformer) {
        await transformer.toFile(OUTPUT);
        const { width } = await sharp(OUTPUT).metadata();
        expect(width).toBe(SIZE);
      }

      await unlink(OUTPUT);
    });

    it('should fail if remote file not exists', async () => {
      const SIZE = 250;
      const INPUT = 'http://localhost:8888/output/fail.jpg';

      try {
        await thumbnailerServiceByRemote(INPUT, SIZE);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
