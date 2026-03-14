"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PowerUpType } from "@/store/gameStore";

type Cell = {
  id: string;
  ownerId: string | null;
  color: string;
  powerUp?: PowerUpType;
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
          const hasPowerUp = cell.powerUp;
          
          return (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, scale: 0.98 }} // Very small scale gap
              animate={hasPowerUp ? { 
                opacity: [1, 0.8, 1, 0.9, 1], // Glitch opacity
                scale: [1, 1.05, 1, 0.95, 1], // Pulse effect
                transition: { 
                  duration: 0.8, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut"
                } 
              } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.08, delay, ease: "easeOut" }} // Very fast duration for initial load
              className={cn(
                "border cursor-pointer relative transition-colors duration-200 flex items-center justify-center",
                isNeutral && !hasPowerUp && "border-[#1A1A32]",
                !isNeutral && !hasPowerUp && "border-white/10",
                hasPowerUp && "border-transparent bg-transparent z-20" // Power-ups pop out
              )}
              style={hasPowerUp ? {} : { backgroundColor: cell.color || "transparent" }}
              whileHover={{ 
                backgroundColor: isNeutral && !hasPowerUp ? "rgba(167, 139, 250, 0.15)" : (hasPowerUp ? "transparent" : "rgba(255,255,255,0.08)"),
                scale: hasPowerUp ? 1.15 : 0.95,
                zIndex: 30,
                boxShadow: isNeutral && !hasPowerUp ? "0 0 15px rgba(167, 139, 250, 0.3)" : (hasPowerUp ? "none" : `0 0 20px ${cell.color}80`),
                borderColor: isNeutral && !hasPowerUp ? "rgba(167, 139, 250, 0.5)" : undefined,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9, 
                rotate: isNeutral ? 2 : -2,
                boxShadow: "0 0 30px rgba(244, 63, 94, 0.6)" // Rose flash on click
              }}
              onClick={() => onCellClick(i, j)}
            >
              {hasPowerUp && (
                  <motion.div 
                    className="w-full h-full absolute inset-0 rounded-[2px]"
                    animate={{
                      boxShadow: [
                        `0 0 10px ${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}, inset 0 0 5px ${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}`,
                        `0 0 25px ${cell.powerUp === 'OVERCLOCK' ? '#fbbf24' : '#38bdf8'}, inset 0 0 15px ${cell.powerUp === 'OVERCLOCK' ? '#fbbf24' : '#38bdf8'}`,
                        `0 0 10px ${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}, inset 0 0 5px ${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}`
                      ],
                      backgroundColor: [
                        `${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}20`,
                        `${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}60`,
                        `${cell.powerUp === 'OVERCLOCK' ? '#f59e0b' : '#0ea5e9'}20`
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-center w-full h-full text-[10px] font-bold text-white uppercase tracking-widest opacity-80" style={{ textShadow: "0 0 10px rgba(255,255,255,0.8)"}}>
                        {cell.powerUp === 'OVERCLOCK' ? '⚡' : '👁️'}
                    </div>
                  </motion.div>
              )}
            </motion.div>
          );
        }),
      )}
    </div>
  );
}
