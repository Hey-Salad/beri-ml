# QA Office Hours — New Session Primer

## Who You Are Working With
**Peter Machona, HeySalad Inc.**
- Cloudflare account: heysalad-o (Workers, Pages, D1, R2, Stream, Durable Objects)
- **Cloudflare credits: $5,000 approved — use Cloudflare for everything possible**
- GCP credits: £700 (expires Oct 2026) — use for Gemini Computer Use compute only
- GitHub org: Hey-Salad
- Raspberry Pi 4 (this machine) — runs Claude Code, has `gh`, `wrangler`, `aws`, `gcloud` CLIs
- Secrets API: `https://apple-pie-sk.heysalad.app` (Cloudflare Worker)
  - Admin key: `hs_admin_e9540aa97947077b12dda1b4c1da0925`
  - GET `/secrets/ai` (Bearer any `ai`-scoped agent key) → returns `{anthropic, openai, cheriml, googleVertex}`
  - GET `/secrets/mac` → SSH key + IP for EC2 Mac builder
- HeySalad MCP: `https://heysalad-mcp-gateway.heysalad-o.workers.dev` (X-API-Key header)
  - Domains: engineering, sales, customer-success, marketing, people, finance, data, executive

---

## What We Are Building: QA Office Hours

A live QA monitoring platform built on Cloudflare + GCP with three components:

### 1. Computer Use Sessions (GCP)
A Python service running on **GCP Cloud Run** that:
- Launches a headless Chromium browser via **Playwright**
- Sends screenshots + goals to **Gemini 2.5 Computer Use** (`gemini-2.5-computer-use-preview-10-2025`) via Vertex AI
- Executes the model's actions (click, type, navigate, scroll)
- Captures a new screenshot after each action
- Streams screenshots to Cloudflare every ~500ms via HTTP POST

The agent loop (from the reference notebook):
```
screenshot → Gemini Computer Use → action (click/type/navigate) → screenshot → repeat
```

Reference implementation: https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/computer-use/intro_computer_use.ipynb

Key model details:
- Model: `gemini-2.5-computer-use-preview-10-2025`
- Uses Vertex AI `ComputerUse` tool with `Environment.ENVIRONMENT_BROWSER`
- Actions: navigate, click, type, scroll, drag_and_drop, screenshot
- Coordinates are normalised 0–1000 (x, y), need converting to pixels

### 2. Streaming + Storage Layer (Cloudflare)
All infrastructure on Cloudflare:

- **Cloudflare Worker** (`qa-stream-worker`): receives screenshot frames from GCP, stores in R2, broadcasts to connected clients
- **Cloudflare R2** (`qa-screenshots`): stores raw screenshot frames (PNG), indexed by `sessionId/timestamp.png`
- **Cloudflare D1** (`qa-database`): stores sessions, frames metadata, QA agent comments, team annotations
- **Cloudflare Durable Objects** (`QASession`): one DO per active session — holds WebSocket connections for all viewers, broadcasts frames in real-time
- **Cloudflare Stream** (optional): for higher-fidelity video recording of sessions

Session flow:
```
GCP Cloud Run → POST /frames/{sessionId} (Worker) → R2 (store) + DO (broadcast) → WebSocket → Browser clients
```

### 3. QA Live Agent (AI Watcher)
An AI agent that monitors every active session:
- Receives the same screenshot stream
- Runs analysis using **Gemini Vision** or **Claude** (via `claude-sonnet-4-6`)
- Generates real-time QA commentary:
  - Bug detection ("Button overlaps text on mobile viewport")
  - UX issues ("5 clicks to complete checkout — too many steps")
  - Performance notes ("Spinner visible for >3s")
  - Test pass/fail status
- Comments stored in D1 and streamed to dashboard via the same Durable Object
- Runs as a **Cloudflare Worker** triggered by each incoming frame (or batched every N frames)

### 4. QA Office Hours Dashboard (Cloudflare Pages)
A React web app deployed to **Cloudflare Pages**:
- **Session Grid**: live thumbnails of all active computer use sessions
- **Session Detail**: full-size live feed + QA agent commentary sidebar
- **Team Mode**: any HeySalad team member (or AI agent) can join, watch, add comments
- **Session Replay**: scrub through past sessions stored in R2
- **QA Report**: auto-generated markdown report per session (bugs found, steps taken, time)
- Auth: simple shared team token (checked against a Cloudflare KV namespace)

---

## Tech Stack Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| Computer Use | GCP Vertex AI (Gemini 2.5) | Only place this model runs |
| Browser Automation | Playwright on Cloud Run | Headless Chromium, easy containerisation |
| Screenshot Streaming | Cloudflare Worker + R2 + DO | Lowest latency, $5k credits |
| Real-time (WebSockets) | Cloudflare Durable Objects | Built for this, no extra infra |
| Database | Cloudflare D1 (SQLite) | Free tier generous, lives next to Workers |
| Frontend | Cloudflare Pages + React + Vite | Free, fast, zero config |
| QA Agent | Cloudflare Worker + Gemini/Claude | Runs at edge next to stream |
| Auth | Cloudflare KV | Simple team-token lookup |
| Video (optional) | Cloudflare Stream | Already in account |

**Do NOT use:** Supabase, Vercel, Railway, Heroku — keep everything on Cloudflare + GCP.

---

## Repository Structure to Create

```
Hey-Salad/qa-office-hours/
├── services/
│   └── computer-use/           # GCP Cloud Run Python service
│       ├── main.py             # FastAPI app, /run endpoint
│       ├── agent_loop.py       # Gemini Computer Use loop
│       ├── playwright_handler.py
│       ├── streamer.py         # Posts frames to Cloudflare
│       ├── requirements.txt
│       └── Dockerfile
├── cloudflare/
│   ├── qa-stream-worker/       # Frame ingestion + DO coordination
│   │   ├── src/
│   │   │   ├── index.ts        # Worker entry: /frames, /sessions, /ws
│   │   │   └── QASession.ts    # Durable Object class
│   │   └── wrangler.toml
│   ├── qa-agent-worker/        # QA AI watcher
│   │   ├── src/
│   │   │   └── index.ts        # Analyses frames, writes comments to D1
│   │   └── wrangler.toml
│   └── schema.sql              # D1 schema
├── dashboard/                  # Cloudflare Pages React app
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── SessionGrid.tsx
│   │   │   ├── SessionViewer.tsx
│   │   │   ├── QACommentary.tsx
│   │   │   └── TeamPanel.tsx
│   │   └── hooks/
│   │       └── useSessionStream.ts  # WebSocket hook
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## D1 Database Schema

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT,
  status TEXT DEFAULT 'active',  -- active, completed, failed
  agent_type TEXT DEFAULT 'gemini-computer-use',
  gcp_project TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  frame_count INTEGER DEFAULT 0
);

CREATE TABLE frames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,           -- e.g. sessions/abc123/0001.png
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  sequence INTEGER NOT NULL,
  action_taken TEXT,              -- JSON: what Gemini did before this frame
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE qa_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  frame_id INTEGER,
  author TEXT NOT NULL,           -- 'qa-agent', 'peter', 'cheri-ml', etc.
  comment TEXT NOT NULL,
  severity TEXT,                  -- 'info', 'warning', 'bug', 'blocker'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE session_viewers (
  session_id TEXT NOT NULL,
  viewer TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Cloudflare Worker API Design (`qa-stream-worker`)

```
POST /sessions                          Create new session
GET  /sessions                          List all sessions
GET  /sessions/:id                      Get session + recent frames
POST /frames/:sessionId                 Ingest frame (from GCP Cloud Run)
GET  /sessions/:id/ws                   WebSocket upgrade (Durable Object)
GET  /sessions/:id/replay               Get all frames from R2 for replay
POST /sessions/:id/comments             Add QA comment
GET  /sessions/:id/report               Generate markdown QA report
```

Frame ingestion payload (from GCP → Worker):
```json
{
  "sequence": 42,
  "imageBase64": "iVBORw0KGgo...",
  "actionTaken": { "name": "click", "args": { "x": 500, "y": 300 } },
  "currentUrl": "https://heysalad.com/checkout",
  "timestamp": "2026-02-21T19:00:00Z"
}
```

---

## GCP Cloud Run Service Design

```python
# POST /run — start a computer use session
{
  "sessionId": "uuid",
  "goal": "Test the checkout flow on heysalad.com",
  "startUrl": "https://heysalad.com",
  "cloudflareWorkerUrl": "https://qa-stream.heysalad.app",
  "cloudflareApiKey": "..."
}
```

The service:
1. Creates a Playwright browser (1920×1080 headless Chromium)
2. Navigates to `startUrl`
3. Enters the Gemini Computer Use agent loop
4. After each action, POSTs the screenshot to the Cloudflare Worker
5. Continues until goal is achieved, max steps reached, or error
6. POSTs a final `status: completed` update

---

## GCP Setup Needed
- Project ID: **[Peter to confirm]**
- Enable APIs: Vertex AI, Cloud Run, Container Registry
- Service account with `roles/aiplatform.user`
- Region: `europe-west2` (London) or `europe-west1` (Belgium) — close to Cloudflare Ireland PoP

---

## Cloudflare Setup Needed
- New Worker: `qa-stream-worker` (handles frames + DO)
- New Worker: `qa-agent-worker` (QA AI analysis)
- New D1 database: `qa-database`
- New R2 bucket: `qa-screenshots`
- New Durable Object namespace: `QASession`
- New Pages project: `qa-office-hours`
- Custom domains: `qa-stream.heysalad.app` + `qa.heysalad.app`
- All secrets from apple-pie-sk: `ANTHROPIC_API_KEY`, `GOOGLE_VERTEX_KEY`

---

## First Steps (in order)

1. Create `Hey-Salad/qa-office-hours` GitHub repo
2. Build the Cloudflare D1 schema + `qa-stream-worker` with Durable Objects
3. Build minimal dashboard (Pages) that connects via WebSocket
4. Build GCP Cloud Run Python service with Gemini Computer Use + Playwright
5. Wire them together: GCP → Worker → DO → Dashboard
6. Add QA agent worker (AI watching the stream)
7. Add team auth (KV token check)
8. Deploy end-to-end and run first session

---

## Key Reference
- Gemini Computer Use notebook: https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/computer-use/intro_computer_use.ipynb
- Model: `gemini-2.5-computer-use-preview-10-2025`
- Vertex AI location: `global`
- Cloudflare Durable Objects docs: https://developers.cloudflare.com/durable-objects/
- Cloudflare D1 docs: https://developers.cloudflare.com/d1/
