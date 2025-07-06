import request from 'supertest';
import mongoose, { isValidObjectId } from 'mongoose';
import app from '../src/infrastructure/server';

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
});

describe('API REST', () => {
  it('should create Task', async () => {
    const response = await request(app).post('/tasks');
    expect(response.status).toBe(200);
    expect(isValidObjectId(response.body.taskId)).toBeTruthy();
    expect(response.body).toStrictEqual({
      taskId: expect.any(String),
      status: 'pending',
      price: expect.any(Number),
    });
  });

  it('should get Task by id', async () => {
    const {
      body: { taskId },
    } = await request(app).post('/tasks');
    const response = await request(app).get(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(isValidObjectId(response.body.taskId)).toBeTruthy();
    expect(response.body).toStrictEqual({
      taskId: expect.any(String),
      status: 'pending',
      price: expect.any(Number),
    });
  });
});
