# VizAI Dashboard - Phase 1 Preview

This preview boots fully without a backend by default (mock mode).

How to run:
- npm install
- npm start
- Open http://localhost:3000

Routes:
- /auth, /animals, /dashboard, /timeline, /reports

Environment variables (optional):
- REACT_APP_API_BASE or REACT_APP_BACKEND_URL: point to backend base URL to disable mock
- REACT_APP_WS_URL: websocket URL (empty simulates disconnect banner)
- REACT_APP_USE_MOCK=1|0: force mock (defaults to 1 if not set)

Notes:
- Demo auth: any email; any password except "fail".
- Data is generated across the last week; includes a long "Scratching" episode for testing.
- Drilldowns: click bars on Overview to navigate to Timeline with filters applied.
- Reports: configure → preview → generate (mock returns a download URL).
