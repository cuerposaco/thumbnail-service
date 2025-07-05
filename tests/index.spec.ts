import request from 'supertest';
import app from '../src/infrastructure/server';

describe('API REST', () => {
  // Test creating a new user
  it('should get main route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ data: 'Hello World!' });
  });
});
