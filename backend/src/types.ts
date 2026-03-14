export type PowerUpType = "OVERCLOCK" | "GLITCH_REVEAL";

export type Cell = {
    id: string;
    ownerId: string | null;
    color: string;
    timestamp: number;
    powerUp?: PowerUpType;
};

export type ClientMessage = 
    | { type: "CAPTURE_CELL"; cellId: string }
    | { type: "SPAWN_POWERUP" } // optional debug action
    | { type: "HELLO"; userId?: string };

export type ServerMessage = {
    type: "CELL_UPDATED" | "GRID_STATE" | "HELLO" | "ERROR";
    payload: unknown;
};

export type SocketData = {
    id: string;
    color: string;
};