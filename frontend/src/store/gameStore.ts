import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Cell = {
  id: string;           // e.g. "10-5"
  ownerId: string | null;
  color: string;        // hex color of the owner, or default empty color
  timestamp: number;    // for conflict resolution
};

export type Player = {
  id: string;
  color: string;
  nickname: string;
  score: number;        // number of cells owned
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const ROWS = 20;
export const COLS = 30;

const PLAYER_COLORS = [
  "#06b6d4", // Electric Cyan
  "#f43f5e", // Neon Rose
  "#f59e0b", // Bright Amber
  "#84cc16", // Vivid Lime
  "#a855f7", // Royal Purple
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#10b981", // Emerald
];

const EMPTY_COLOR = "#0f172a"; // Slate 900



function generateUserId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pickColor(userId: string): string {
  const index =
    userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    PLAYER_COLORS.length;
  return PLAYER_COLORS[index];
}

function buildEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => ({
      id: `${i}-${j}`,
      ownerId: null,
      color: EMPTY_COLOR,
      timestamp: 0,
    }))
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

type GameState = {
  // Grid
  cells: Cell[][];
  rows: number;
  cols: number;

  // Current user
  currentUserId: string;
  currentUserColor: string;
  currentUserNickname: string;

  // Online players map  id → Player
  players: Record<string, Player>;

  // Connection
  isConnected: boolean;

  // Actions
  captureCell: (row: number, col: number) => void;
  applyServerUpdate: (row: number, col: number, cell: Cell) => void;
  setConnected: (connected: boolean) => void;
  setNickname: (name: string) => void;
  setPlayers: (players: Record<string, Player>) => void;
  initGrid: (cells: Cell[][]) => void;
  setCurrentUser: (id: string, color: string) => void;
};

export const useGameStore = create<GameState>((set, get) => {
  const currentUserId = generateUserId();
  const currentUserColor = pickColor(currentUserId);

  return {
    // ── Initial state ──────────────────────────────────────────────────────
    cells: buildEmptyGrid(ROWS, COLS),
    rows: ROWS,
    cols: COLS,

    currentUserId,
    currentUserColor,
    currentUserNickname: "Anonymous",

    players: {},
    isConnected: false,

    // ── Actions ────────────────────────────────────────────────────────────

    /**
     * Optimistic local capture. Call this immediately on click,
     * then emit CAPTURE_CELL to the server. The server will broadcast
     * CELL_UPDATED which calls applyServerUpdate() to reconcile.
     */
    captureCell: (row, col) => {
      const { cells, currentUserId, currentUserColor } = get();
      const now = Date.now();

      // Build a new grid with the updated cell (immutable update)
      const newCells = cells.map((r, i) =>
        i !== row
          ? r
          : r.map((cell, j) =>
              j !== col
                ? cell
                : {
                    ...cell,
                    ownerId: currentUserId,
                    color: currentUserColor,
                    timestamp: now,
                  }
            )
      );

      set({ cells: newCells });
    },

    /**
     * Apply a server-authoritative cell update.
     * Called when the server broadcasts CELL_UPDATED.
     * Uses timestamp to resolve conflicts (last-write-wins).
     */
    applyServerUpdate: (row, col, serverCell) => {
      const { cells } = get();
      const existing = cells[row]?.[col];
      if (!existing) return;

      // Only apply if server update is newer
      if (serverCell.timestamp < existing.timestamp) return;

      const newCells = cells.map((r, i) =>
        i !== row
          ? r
          : r.map((cell, j) => (j !== col ? cell : { ...serverCell }))
      );

      set({ cells: newCells });
    },

    /** Replace the entire grid (called on initial connection with server state) */
    initGrid: (cells) => set({ cells }),

    setConnected: (isConnected) => set({ isConnected }),

    setNickname: (name) =>
      set({ currentUserNickname: name.trim() || "Anonymous" }),

    setPlayers: (players) => set({ players }),

    /** Called after receiving HELLO from server — syncs our identity with server-assigned ID */
    setCurrentUser: (id, color) =>
      set({ currentUserId: id, currentUserColor: color }),
  };
});
