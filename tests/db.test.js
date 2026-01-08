const db = require('../db');

describe('DB module', () => {
  test('reopen and save/get messages', () => {
    db.reopen(':memory:');
    db.saveMessage('user', 'x');
    db.saveMessage('bot', 'y');
    const all = db.getHistory(10);
    expect(all.length).toBeGreaterThanOrEqual(2);
    const texts = all.map((m) => m.text);
    expect(texts).toEqual(expect.arrayContaining(['x', 'y']));
  });
});
