const form = document.getElementById('form');
const input = document.getElementById('input');
const chat = document.getElementById('chat');
const sendBtn = form.querySelector('button');

function appendMessage(text, cls) {
  const div = document.createElement('div');
  div.className = `message ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setLoading(on) {
  sendBtn.disabled = on;
  input.disabled = on;
  if (on) {
    appendMessage('…', 'bot typing');
  } else {
    const el = chat.querySelector('.message.bot.typing');
    if (el) el.remove();
  }
}

function saveHistory(messages) {
  try {
    localStorage.setItem('gw_chat_history', JSON.stringify(messages.slice(-100)));
  } catch (e) {
    /* ignore */
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('gw_chat_history') || '[]');
  } catch (e) {
    return [];
  }
}

// render history
const history = loadHistory();
if (history.length) {
  history.forEach((m) => appendMessage(m.text, m.cls));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  history.push({ text: message, cls: 'user' });
  saveHistory(history);
  input.value = '';

  setLoading(true);
  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      appendMessage(err.error || 'Server error', 'bot');
      history.push({ text: err.error || 'Server error', cls: 'bot' });
      saveHistory(history);
      return;
    }

    const data = await res.json();
    const reply = data.reply || 'No response';
    appendMessage(reply, 'bot');
    history.push({ text: reply, cls: 'bot' });
    saveHistory(history);
  } catch (err) {
    appendMessage('Error contacting server', 'bot');
    console.error(err);
    history.push({ text: 'Error contacting server', cls: 'bot' });
    saveHistory(history);
  } finally {
    setLoading(false);
  }
});

// accessibility: focus input on load
input.focus();
