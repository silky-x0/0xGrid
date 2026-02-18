"use client";
import { GameGrid } from "@/components/game/GameGrid";
import { useGameStore } from "@/store/gameStore";
import { useSocket } from "@/hooks/useSocket";

export default function GamePage() {
  const { cells, rows, cols, captureCell, currentUserId } = useGameStore();
  const { sendCapture } = useSocket();

  function handleCellClick(row: number, col: number) {
    captureCell(row, col); // optimistic local update
    sendCapture(row, col); // send to server → server broadcasts to all
  }

  return (
    <GameGrid
      rows={rows}
      cols={cols}
      cells={cells}
      onCellClick={handleCellClick}
      currentUserId={currentUserId}
    />
  );
}
