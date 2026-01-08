const request = require('supertest');

// Use module mock for ai.js so tests don't depend on real fetch
jest.mock('../ai', () => ({ getAIReply: jest.fn(async () => 'AI reply') }));
const app = require('../server');
const { getAIReply } = require('../ai');

describe('AI integration (mocked)', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('POST /api/message uses AI when OPENAI_API_KEY present', async () => {
    const res = await request(app).post('/api/message').send({ message: 'Hello AI' }).expect(200);
    expect(res.body.reply).toBe('AI reply');
    expect(getAIReply).toHaveBeenCalled();
  });
});
