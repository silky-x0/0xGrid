# 0xGrid

Real-time grid battle game. Players compete to capture territory on a shared board. Every click claims a cell and the change is instantly visible to all connected players.

---

## Architecture

The project is split into two independent services:

```
0xGrid/
├── frontend/   Next.js app (React 19, Tailwind CSS v4)
└── backend/    Bun WebSocket server (TypeScript)
```

The frontend and backend communicate exclusively over WebSockets. There is no REST API.

### Data Flow

1. User clicks a cell in the browser.
2. The frontend sends a `CAPTURE_CELL` message to the backend over WebSocket.
3. The backend validates the request, updates the in-memory grid state, and broadcasts a `CELL_UPDATED` message to all connected clients.
4. Every connected browser receives the update and re-renders the affected cell.

---

## Tech Stack

| Layer           | Technology           | Purpose                          |
| --------------- | -------------------- | -------------------------------- |
| Frontend        | Next.js 16, React 19 | UI framework                     |
| Styling         | Tailwind CSS v4      | Design system                    |
| Backend         | Bun                  | WebSocket server runtime         |
| Language        | TypeScript           | Type safety across both services |
| Real-time       | Bun native WebSocket | Client-server communication      |
| State (Phase 1) | In-memory Map        | Grid state store                 |
| State (Phase 2) | Redis                | Persistent, shared grid state    |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or later installed on your system.

### Clone the repository

```bash
git clone https://github.com/silky-x0/0xGrid.git
cd 0xGrid
```

### Backend

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

### Frontend

```bash
cd frontend
bun install
bun run dev
```

The Next.js app starts on `http://localhost:3000`.

---

## WebSocket Protocol

All messages are JSON strings. The client and server communicate using the following message types.

### Client to Server

| Type           | Payload              | Description              |
| -------------- | -------------------- | ------------------------ |
| `CAPTURE_CELL` | `{ cellId: string }` | Claim a cell on the grid |

### Server to Client

| Type           | Payload  | Description                           |
| -------------- | -------- | ------------------------------------- |
| `GRID_STATE`   | `Cell[]` | Full grid snapshot sent on connection |
| `CELL_UPDATED` | `Cell`   | Broadcast when any cell is captured   |
| `ERROR`        | `string` | Error message from the server         |

### Cell shape

```typescript
type Cell = {
  id: string; // Format: "x{col}-y{row}", e.g. "x5-y10"
  ownerId: string; // UUID of the player who captured this cell
  color: string; // Hex color assigned to that player
  timestamp: number; // Unix timestamp in milliseconds
};
```

---

## Development Roadmap

### Phase 1 - Foundation (current)

- [x] Backend WebSocket server with Bun
- [x] In-memory grid state with `Map`
- [x] Per-client UUID identity via `ws.data`
- [x] Broadcast on cell capture
- [ ] Frontend grid component
- [ ] Connect frontend to WebSocket

### Phase 2 - Real-time at Scale

- [ ] Replace in-memory Map with Redis
- [ ] Handle server restarts without losing grid state
- [ ] Cooldown system to prevent spam

### Phase 3 - Game Loop

- [ ] Leaderboard (top capturers)
- [ ] User nicknames
- [ ] Minimap for large grids
- [ ] Animations and sound effects

---

## License

MIT
