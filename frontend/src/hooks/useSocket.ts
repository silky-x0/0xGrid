import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import type { Cell } from "@/store/gameStore";

const WS_URL = process.env.NEXT_PUBLIC_WSS_URL || "ws://localhost:8080";

type ServerMessage =
  | { type: "HELLO"; payload: { id: string; color: string } }
  | { type: "GRID_STATE"; payload: Cell[] }
  | { type: "CELL_UPDATED"; payload: Cell }
  | { type: "ERROR"; payload: unknown };

export function useSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { initGrid, applyServerUpdate, setConnected, setCurrentUser } =
    useGameStore();

  const sendCapture = useCallback((row: number, col: number) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "CAPTURE_CELL", cellId: `${row}-${col}` }));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("[socket] connected");

      // Identify ourselves
      const storedId = sessionStorage.getItem("utils-grid-userid");
      ws.send(
        JSON.stringify({
          type: "HELLO",
          userId: storedId || undefined,
        }),
      );
    };

    ws.onmessage = (event) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data as string) as ServerMessage;
      } catch {
        console.warn("[socket] malformed message", event.data);
        return;
      }

      switch (msg.type) {
        case "HELLO": {
          const { id, color } = msg.payload;
          setCurrentUser(id, color);
          sessionStorage.setItem("utils-grid-userid", id);
          break;
        }

        case "GRID_STATE": {
          // Server sends a flat array of captured cells.
          // Re-build the full 2D grid from the store's empty grid,
          // then patch in the captured cells.
          const { cells } = useGameStore.getState();
          const patched = cells.map((row) => row.map((cell) => ({ ...cell })));

          for (const serverCell of msg.payload) {
            // cellId is "row-col"
            const [r, c] = serverCell.id.split("-").map(Number);
            if (patched[r]?.[c]) {
              patched[r][c] = serverCell;
            }
          }

          initGrid(patched);
          break;
        }

        case "CELL_UPDATED": {
          const cell = msg.payload;
          const [r, c] = cell.id.split("-").map(Number);
          applyServerUpdate(r, c, cell);
          break;
        }

        default:
          console.warn("[socket] unknown message type", msg);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("[socket] disconnected");
    };

    ws.onerror = (err) => {
      console.error("[socket] error", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { sendCapture };
}
