# Groundwater Chatbot

Simple local chatbot. Quick commands:

- Install: `npm install`
- Dev server: `npm run dev` or use the included PowerShell helper:
  - `.\	emplates\scripts\dev.ps1 start` (PowerShell)
  - `.\scripts
dev.ps1 status`
  - `.\scripts\dev.ps1 stop`

API:
- `POST /api/message` — JSON `{ "message": "text" }` → `{ "reply": "..." }`
- `GET /api/history` — returns message history
- `GET /health` — readiness check

Note: On Windows you can use `.\scripts\dev.ps1 start` to launch and `.\scripts\dev.ps1 stop` to stop the local server.