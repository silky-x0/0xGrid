"use client";

import { motion, Variants } from "framer-motion";
import { Boxes } from "../ui/background-boxes";

// Palette:
// #222831 — darkest background
// #393E46 — surface / card
// #00ADB5 — accent (teal)
// #EEEEEE — primary text

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export default function Hero() {
  return (
    <div
      className='min-h-screen w-full overflow-hidden relative flex items-center justify-center'
      style={{ backgroundColor: "#222831" }}
    >
      {/* Animated grid background */}
      <Boxes />

      {/* Overlay */}
      <div
        className='absolute inset-0 z-10 pointer-events-none'
        style={{ backgroundColor: "rgba(34,40,49,0.55)" }}
      />

      {/* Hero content */}
      <div className='relative z-20 flex flex-col items-center text-center px-4 sm:px-8 w-full max-w-4xl mx-auto gap-5 sm:gap-7 py-16 sm:py-0'>
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial='hidden'
          animate='visible'
          className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs tracking-widest uppercase'
          style={{
            border: "1px solid rgba(0,173,181,0.35)",
            backgroundColor: "rgba(0,173,181,0.08)",
            color: "#00ADB5",
          }}
        >
          <span
            className='w-1.5 h-1.5 rounded-full animate-pulse'
            style={{ backgroundColor: "#00ADB5" }}
          />
          Real-time Strategy · Live Now
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          custom={0.1}
          initial='hidden'
          animate='visible'
          className='font-bold leading-none tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
          style={{
            background: "linear-gradient(to bottom, #EEEEEE, #393E46)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          0xGrid
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={0.2}
          initial='hidden'
          animate='visible'
          className='font-mono tracking-widest uppercase text-base sm:text-lg md:text-xl'
          style={{ color: "#00ADB5" }}
        >
          GridWars
        </motion.p>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          custom={0.3}
          initial='hidden'
          animate='visible'
          className='text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl leading-relaxed'
          style={{ color: "rgba(238,238,238,0.6)" }}
        >
          Claim cells. Outmaneuver rivals. Dominate the grid in real-time. Every
          block is a battle — how far can you expand?
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          custom={0.45}
          initial='hidden'
          animate='visible'
          className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-1 w-full sm:w-auto'
        >
          <button
            className='group w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-lg font-mono font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95'
            style={{
              backgroundColor: "#00ADB5",
              color: "#222831",
              boxShadow: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 28px rgba(0,173,181,0.55)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Start Game
            <span className='ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1'>
              →
            </span>
          </button>

          <button
            className='w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-lg font-mono font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95'
            style={{
              color: "#EEEEEE",
              border: "1px solid #393E46",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00ADB5";
              e.currentTarget.style.color = "#00ADB5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#393E46";
              e.currentTarget.style.color = "#EEEEEE";
            }}
          >
            How to Play
          </button>
        </motion.div>

        {/* Stat row */}
        <motion.div
          variants={fadeUp}
          custom={0.55}
          initial='hidden'
          animate='visible'
          className='flex items-center gap-6 sm:gap-10 mt-2 font-mono text-sm sm:text-base'
          style={{ color: "rgba(238,238,238,0.5)" }}
        >
          <span className='flex items-center gap-1.5'>
            {/* Infinity SVG */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-5 h-5 sm:w-6 sm:h-6'
              style={{ color: "#00ADB5" }}
            >
              <path d='M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z' />
              <path d='M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z' />
            </svg>
            Players
          </span>
          <span
            className='w-px h-5'
            style={{ backgroundColor: "rgba(238,238,238,0.15)" }}
          />
          <span>
            <span style={{ color: "#00ADB5" }} className='font-semibold'>
              Real-time
            </span>{" "}
            Updates
          </span>
          <span
            className='w-px h-5'
            style={{ backgroundColor: "rgba(238,238,238,0.15)" }}
          />
          <span>
            <span style={{ color: "#00ADB5" }} className='font-semibold'>
              1
            </span>{" "}
            Grid
          </span>
        </motion.div>
      </div>
    </div>
  );
}
