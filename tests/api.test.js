const request = require('supertest');
const app = require('../server');

describe('API', () => {
  test('GET / serves homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/html/);
  });

  test('POST /api/message returns reply', async () => {
    const res = await request(app).post('/api/message').send({ message: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(res.body.reply).toMatch(/GroundwaterBot|Groundwater/);
  });

  test('POST /api/message without message returns 400', async () => {
    const res = await request(app).post('/api/message').send({});
    expect(res.statusCode).toBe(400);
  });
});
