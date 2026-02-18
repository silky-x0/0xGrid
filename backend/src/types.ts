
export type Cell = {
    id: string;
    ownerId: string | null;
    color: string;
    timestamp: number;
};

export type ClientMessage = {
    type: "CAPTURE_CELL";
    cellId: string;
    
};

export type ServerMessage = {
    type: "CELL_UPDATED" | "GRID_STATE" | "ERROR";
    payload: unknown;
};

export type  SocketData = {
    id: string;
};