const form = document.getElementById('form');
const input = document.getElementById('input');
const chat = document.getElementById('chat');

function appendMessage(text, cls) {
  const div = document.createElement('div');
  div.className = `message ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  input.value = '';
  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    appendMessage(data.reply || 'No response', 'bot');
  } catch (err) {
    appendMessage('Error contacting server', 'bot');
    console.error(err);
  }
});
