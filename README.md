<h1 align="center">0xGrid</h1>

Real-time grid battle game where players compete to capture territory on a shared board. Every click claims a cell, and the change is instantly visible to all connected players.

<video src="https://github.com/silky-x0/0xGrid/raw/main/frontend/public/demo.mp4" controls="controls" width="100%" muted="muted" playsinline="playsinline">
</video>

---

<h2 align="center">Architecture</h2>

The project is split into two independent services:

```text
0xGrid/
├── frontend/   Next.js app (React 19, Tailwind CSS v4)
└── backend/    Bun WebSocket server (TypeScript)
```

The frontend and backend communicate exclusively over WebSockets. There is no REST API.

<h3 align="center">Data Flow</h3>

1. User clicks a cell in the browser.
2. The frontend sends a `CAPTURE_CELL` message to the backend over WebSocket.
3. The backend validates the request, updates the in-memory grid state, and broadcasts a `CELL_UPDATED` message to all connected clients.
4. Every connected browser receives the update and re-renders the affected cell.

---

<h2 align="center">Tech Stack</h2>

| Layer           | Technology           | Purpose                          |
| --------------- | -------------------- | -------------------------------- |
| Frontend        | Next.js 16, React 19 | UI framework                     |
| Styling         | Tailwind CSS v4      | Design system                    |
| Backend         | Bun                  | WebSocket server runtime         |
| Language        | TypeScript           | Type safety across both services |
| Real-time       | Bun native WebSocket | Client-server communication      |
| State (Phase 1) | In-memory Map        | Grid state store                 |
| State (Phase 2) | Redis or Prisma      | Persistent, shared grid state    |

---

<h2 align="center">Getting Started</h2>

<h3>Prerequisites</h3>

- [Bun](https://bun.sh) v1.0 or later installed on your system.

<h3>Clone the repository</h3>

```bash
git clone https://github.com/silky-x0/0xGrid.git
cd 0xGrid
```

<h3>Backend</h3>

```bash
cd backend
bun install
bun run dev
```

The WebSocket server starts on `ws://localhost:8080`.

To verify it is running, open a browser console and run:

```javascript
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => console.log("Connected");
ws.onmessage = (e) => console.log("Message:", JSON.parse(e.data));
```

<h3>Frontend</h3>

Before starting, if you want to point to a remote server, create `.env` in the frontend directory:

```env
NEXT_PUBLIC_WSS_URL=wss://your-backend.url
```

```bash
cd frontend
bun install
bun run dev
```

The app starts on `http://localhost:3000`.

---

<h2 align="center">WebSocket Protocol</h2>

All messages are JSON strings. The client and server communicate using the following message types.

<h3>Client to Server</h3>

| Type           | Payload               | Description                                 |
| -------------- | --------------------- | ------------------------------------------- |
| `HELLO`        | `{ userId?: string }` | Sends saved ID on connect to resume session |
| `CAPTURE_CELL` | `{ cellId: string }`  | Claims a cell on the grid                   |

<h3>Server to Client</h3>

| Type           | Payload                         | Description                           |
| -------------- | ------------------------------- | ------------------------------------- |
| `HELLO`        | `{ id: string, color: string }` | Identifies the client and their color |
| `GRID_STATE`   | `Cell[]`                        | Full grid snapshot sent on connection |
| `CELL_UPDATED` | `Cell`                          | Broadcast when any cell is captured   |
| `ERROR`        | `{ message: string }`           | Error message from the server         |

<h3>Cell shape</h3>

```typescript
type Cell = {
  id: string; // Format: "{row}-{col}", e.g. "5-10"
  ownerId: string; // UUID of the player who captured this cell
  color: string; // Hex color assigned to that player
  timestamp: number; // Unix timestamp in milliseconds
};
```

---

<h2 align="center">Development Roadmap</h2>

<h3>Phase 1 - Foundation (Completed)</h3>

- [x] Backend WebSocket server with Bun
- [x] In-memory grid state with `Map`
- [x] Per-client persistent identity mapping via Session Storage
- [x] Broadcast on cell capture
- [x] Frontend grid component with responsive panning/zooming

<h3>Phase 2 - Real-time at Scale</h3>

- [ ] Implement database integration (Prisma/PostgreSQL) for persistence
- [ ] Handle server restarts without losing grid state
- [ ] Establish strict cooldown system to prevent spam

<h3>Phase 3 - Game Loop</h3>

- [ ] Global Leaderboard tracking top capturers
- [ ] Configurable User nicknames
- [ ] Minimap for large geographic grids
- [ ] Smooth CSS Animations and sound effects

---

License: MIT
