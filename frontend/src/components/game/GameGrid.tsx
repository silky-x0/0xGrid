"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Cell = {
  id: string;
  ownerId: string | null;
  color: string;
};

type GameGridProps = {
  rows: number;
  cols: number;
  cells: Cell[][];
  onCellClick: (row: number, col: number) => void;
  currentUserId: string;
};

export function GameGrid({
  rows,
  cols,
  cells,
  onCellClick,
  currentUserId,
}: GameGridProps) {
  return (
    <div
      className='w-screen h-screen overflow-hidden'
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells.map((row, i) =>
        row.map((cell, j) => (
          <motion.div
            key={cell.id}
            className={cn(
              "border border-[#1a2a3a] cursor-pointer relative",
              cell.ownerId === currentUserId &&
                "ring-1 ring-inset ring-white/20",
            )}
            style={{ backgroundColor: cell.color }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCellClick(i, j)}
          />
        )),
      )}
    </div>
  );
}
