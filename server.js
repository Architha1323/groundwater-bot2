const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_NAME = process.env.BOT_NAME || 'GroundwaterBot';

// Basic in-memory rate limiter (per IP)
const rateMap = new Map();
const RATE_LIMIT_MAX = 10; // requests
const RATE_LIMIT_WINDOW = 10 * 1000; // ms

app.post('/api/message', (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const entry = rateMap.get(ip) || { count: 0, start: now };
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      entry.count = 0;
      entry.start = now;
    }
    entry.count += 1;
    rateMap.set(ip, entry);
    if (entry.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many requests, slow down' });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string')
      return res.status(400).json({ error: 'No message provided' });
    if (message.length > 1000) return res.status(400).json({ error: 'Message too long' });

    // Simple canned response (replace with real AI integration later)
    const sanitized = message.replace(/\s+/g, ' ').trim();
    const reply = `Hi, I'm ${BOT_NAME}. You said: "${sanitized}". I can help with groundwater topics like aquifers, recharge, and contamination.`;
    res.json({ reply });
  } catch (err) {
    console.error('Error in /api/message', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
