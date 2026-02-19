import type { ServerWebSocket } from "bun";
import type { Cell, ClientMessage, ServerMessage, SocketData } from "./types";

// our temp db for now
const gridState = new Map<string, Cell>();

let colorIndex = 0;

function getGoldenAngleColor(index: number): string {
  // 137.5 is the golden angle in degrees.
  // It ensures that even with a simple counter, colors are maximally distant 
  // from each other on the color wheel, preventing collisions for a LONG time.
  const hue = (index * 137.508) % 360; 
  return `hsl(${hue}, 70%, 50%)`;
}

// A `Set` is like an array, but every item is unique.
// We use it to track every currently-connected WebSocket client.
// When we want to broadcast a message to everyone, we loop over this Set.
//
// Question to think about: What happens to this Set when the server restarts?
// it resets, state is lost.
//

const connectedClients = new Set<ServerWebSocket<SocketData>>();


function broadcast(message: ServerMessage): void {

  // WebSockets can only transmit strings (or binary), not raw JS objects.

  const serialized = JSON.stringify(message);

  for (const client of connectedClients) {
    client.send(serialized);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// THE SERVER
//
// `Bun.serve()` creates an HTTP server. The `fetch` handler runs for every
// incoming HTTP request — just like a normal web server.
//
// The magic: if the request has an `Upgrade: websocket` header, we call
// `server.upgrade(req)` to switch from HTTP to WebSocket protocol.
// After that, the `websocket` handlers below take over.
// ─────────────────────────────────────────────────────────────────────────────
// The <SocketData> generic here is the KEY fix.
// It tells Bun: "every WebSocket connection in this server will have
// a `.data` property shaped like SocketData". Without it, TypeScript
// infers `ws.data` as `undefined` everywhere — causing all the type errors.
const server = Bun.serve<SocketData>({
  port: Number(process.env.PORT) || 8080,

  fetch(req, server) {
    const upgraded = server.upgrade(req, {
      data: { id: "", color: "" }, // Placeholder until HELLO
    });
    if (upgraded) {
      return undefined;
    }
    return new Response("0xGrid WebSocket Server is running.", { status: 200 });
  },

  websocket: {

    // Fires when a new client successfully connects.
    // Fires when a new client successfully connects.
    open(ws) {
      connectedClients.add(ws);
      console.log(`Client connected (waiting for HELLO). Total clients: ${connectedClients.size}`);
    },

    // Fires when a client sends a message to the server.
    message(ws, rawMessage) {
      let message: ClientMessage;
      try {
        message = JSON.parse(rawMessage as string) as ClientMessage;
      } catch {
        console.warn("Received malformed JSON, ignoring.");
        return;
      }

      console.log("Received:", message);

      switch (message.type) {
        case "HELLO": {
          // Client is introducing themselves.
          // If they sent a userId, use it. Otherwise generate new.
          const userId = message.userId || crypto.randomUUID();
          
          // Deterministic color from ID so it persists across sessions/restarts
          // Simple string hash
          let hash = 0;
          for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
          }
          // Use absolute value and golden angle
          const color = getGoldenAngleColor(Math.abs(hash));

          ws.data.id = userId;
          ws.data.color = color;

          console.log(`Client identified as ${userId.slice(0, 8)}... (${color})`);

          // Confirm identity back to client
          ws.send(JSON.stringify({
            type: "HELLO",
            payload: { id: userId, color },
          }));

          // NOW send the grid state
          ws.send(JSON.stringify({
            type: "GRID_STATE",
            payload: Array.from(gridState.values()),
          }));
          break;
        }

        case "CAPTURE_CELL": {
          // Ignore captures from unidentified clients
          if (!ws.data.id) return;

          const ownerId = ws.data.id;
          const color = ws.data.color;

          const newCell: Cell = {
            id: message.cellId,
            ownerId,
            color,
            timestamp: Date.now(),
          };

          gridState.set(newCell.id, newCell);

          console.log(`Cell ${newCell.id} captured by ${ownerId.slice(0, 8)}...`);

          broadcast({
            type: "CELL_UPDATED",
            payload: newCell,
          });

          break;
        }

        default:
          console.warn("Unknown message type received:", message);
      }
    },

    // Fires when a client disconnects (tab closed, network lost, etc.)
    close(ws) {
      // Remove this client from the Set so we stop trying to send them messages.
      // Sending to a closed WebSocket would throw an error.
      connectedClients.delete(ws);

      console.log(`Client ${ws.data.id.slice(0, 8)}... disconnected. Total clients: ${connectedClients.size}`);
    },

  },
});

console.log(`Server running on ws://localhost:${server.port}`);
