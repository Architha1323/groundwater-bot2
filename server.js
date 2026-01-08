const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_NAME = process.env.BOT_NAME || 'GroundwaterBot';

app.post('/api/message', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // Simple canned response (replace with real AI integration later)
  const reply = `Hi, I'm ${BOT_NAME}. You said: "${message}". I can help with groundwater topics like aquifers, recharge, and contamination.`;
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
