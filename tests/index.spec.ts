import { Server } from 'http';
import { rm } from 'fs/promises';
import request from 'supertest';
import express from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import app from '../src/infrastructure/server';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const MONGO_URI = `localhost:27017`;

// Connect to the MongoDB database before all tests
beforeAll(async () => {
  const url = `mongodb://${MONGO_URI}/integration_testing`;
  await mongoose.connect(url, {});
});

// Clean up the database and close the connection after all tests
afterAll(async () => {
  await mongoose.connection?.db?.dropDatabase();
  await mongoose.connection.close();
  await rm('output/2000x1000_image-test/', { recursive: true });
});

describe('API REST', () => {
  describe('POST /tasks', () => {
    const LOCAL_FILE_PAYLOAD = {
      imagePath: 'output/2000x1000_image-test.jpg',
    };

    it('should fail create Task if payload not provided', async () => {
      const response = await request(app).post('/tasks');

      expect(response.status).toBe(400);
    });

    describe('payload "imagePath"', () => {
      it('should create Task', async () => {
        const response = await request(app)
          .post('/tasks')
          .send(LOCAL_FILE_PAYLOAD);

        expect(response.status).toBe(201);
        expect(isValidObjectId(response.body.taskId)).toBeTruthy();
        expect(response.body).toStrictEqual({
          taskId: expect.any(String),
          status: 'pending',
          price: expect.any(Number),
        });
      });
    });

    describe('payload "imageUri"', () => {
      let server: Server;
      const REMOTE_FILE_PAYLOAD = {
        imageUri: 'http://localhost:8888/output/2000x1000_image-test.jpg',
      };

      beforeAll(async () => {
        const app = express();
        app.use('/output', express.static('output'));
        server = await app.listen(8888);
      });

      afterAll(async () => {
        await server.close();
      });

      it('should create Task', async () => {
        const response = await request(app)
          .post('/tasks')
          .send(REMOTE_FILE_PAYLOAD);

        expect(response.status).toBe(201);
        expect(isValidObjectId(response.body.taskId)).toBeTruthy();
        expect(response.body).toStrictEqual({
          taskId: expect.any(String),
          status: 'pending',
          price: expect.any(Number),
        });
      });
    });
  });

  describe('GET /tasks/:taskId', () => {
    it('should get Task by id', async () => {
      const LOCAL_FILE_PAYLOAD = {
        imagePath: 'output/2000x1000_image-test.jpg',
      };
      // Create a new task
      const {
        body: { taskId },
      } = await request(app).post('/tasks').send(LOCAL_FILE_PAYLOAD);
      await sleep(1000);

      // Get previous created
      const response = await request(app).get(`/tasks/${taskId}`);
      expect(response.status).toBe(200);
      expect(isValidObjectId(response.body.taskId)).toBeTruthy();
      expect(response.body).toStrictEqual({
        taskId: expect.any(String),
        status: 'completed',
        price: expect.any(Number),
        images: expect.any(Array),
      });
      expect(response.body.images).toHaveLength(2);
      expect(response.body.images).toEqual([
        {
          resolution: '800',
          path: expect.any(String),
        },
        {
          resolution: '1024',
          path: expect.any(String),
        },
      ]);
    });
  });
});
