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
      className='w-screen h-screen overflow-auto bg-[#0F0F23]'
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(40px, 1fr))`,
      }}
    >
      {cells.map((row, i) =>
        row.map((cell, j) => {
          const isOwnedByMe = cell.ownerId === currentUserId;
          const isNeutral = !cell.ownerId;
          const delay = (i * cols + j) * 0.0008; // Even quicker trail
          
          return (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, scale: 0.98 }} // Very small scale gap
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.08, delay, ease: "easeOut" }} // Very fast duration
              className={cn(
                "border cursor-pointer relative transition-colors duration-200",
                isNeutral && "border-[#1A1A32]",
                !isNeutral && "border-white/10",
                isOwnedByMe && "ring-1 ring-inset ring-[#7C3AED]/70 shadow-[inset_0_0_12px_rgba(124,58,237,0.4)]"
              )}
              style={{ backgroundColor: cell.color || "transparent" }}
              whileHover={{ 
                backgroundColor: isNeutral ? "rgba(167, 139, 250, 0.15)" : "rgba(255,255,255,0.08)",
                scale: 0.95,
                zIndex: 10,
                boxShadow: isNeutral ? "0 0 15px rgba(167, 139, 250, 0.3)" : `0 0 20px ${cell.color}80`,
                borderColor: isNeutral ? "rgba(167, 139, 250, 0.5)" : undefined,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9, 
                rotate: isNeutral ? 2 : -2,
                boxShadow: "0 0 30px rgba(244, 63, 94, 0.6)" // Rose flash on click
              }}
              onClick={() => onCellClick(i, j)}
            >
              {/* Optional: Add a subtle inner flash overlay if recently captured, based on state. 
                  For now we rely on the transition-colors and motion properties. */}
            </motion.div>
          );
        }),
      )}
    </div>
  );
}
