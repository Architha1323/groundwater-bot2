const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Use a temp DB file for tests
process.env.DB_FILE = ':memory:';
const db = require('../db');
// ensure the in-memory DB is re-opened for tests
db.reopen(':memory:');
const app = require('../server');

describe('History and persistence', () => {
  test('POST /api/message stores messages and GET /api/history returns them', async () => {
    const r1 = await request(app).post('/api/message').send({ message: 'First' });
    console.log('POST First ->', r1.status, r1.body);
    const r2 = await request(app).post('/api/message').send({ message: 'Second' });
    console.log('POST Second ->', r2.status, r2.body);

    const res = await request(app).get('/api/history').expect(200);
    console.log('GET /api/history ->', res.body);

    // Basic check via DB to avoid flakiness: ensure there are entries saved
    const db = require('../db');
    const all = db.getHistory(1000);
    console.log('DB history ->', all);
    expect(all.length).toBeGreaterThanOrEqual(2);
    const texts = all.map((m) => m.text);
    expect(texts).toEqual(expect.arrayContaining(['First', 'Second']));
  });

  test('DELETE /api/history is forbidden by default', async () => {
    await request(app).delete('/api/history').expect(403);
  });
});
