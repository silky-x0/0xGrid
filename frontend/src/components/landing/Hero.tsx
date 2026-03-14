"use client";

import { motion, Variants } from "framer-motion";
import { Boxes } from "../ui/background-boxes";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div
      className='min-h-screen w-full overflow-hidden relative flex items-center justify-center bg-[#0F0F23]'
    >
      {/* Animated grid background */}
      <Boxes />

      {/* Overlay */}
      <div
        className='absolute inset-0 z-10 pointer-events-none'
        style={{ backgroundColor: "rgba(15, 15, 35, 0.75)" }}
      />

      {/* Hero content */}
      <motion.div 
        className='relative z-20 flex flex-col items-center text-center px-4 sm:px-8 w-full max-w-4xl mx-auto gap-5 sm:gap-7 py-16 sm:py-0'
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial='hidden'
          animate='visible'
          className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(167,139,250,0.1)]'
          style={{
            border: "1px solid rgba(167, 139, 250, 0.35)",
            backgroundColor: "rgba(167, 139, 250, 0.08)",
            color: "#A78BFA",
          }}
        >
          <span
            className='w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_#A78BFA]'
            style={{ backgroundColor: "#A78BFA" }}
          />
          Real-time Strategy · Live Now
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          custom={0.1}
          initial='hidden'
          animate='visible'
          className='font-bold leading-none tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl relative'
          style={{
            background: "linear-gradient(to right bottom, #E2E8F0, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 20px rgba(167, 139, 250, 0.15)",
          }}
        >
          0xGrid
          <motion.span 
            className="absolute inset-0 bg-white/20 mix-blend-overlay"
            animate={{ opacity: [0, 0.5, 0], x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 5 }}
            style={{ WebkitBackgroundClip: "text", backgroundClip: "text" }}
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={0.2}
          initial='hidden'
          animate='visible'
          className='font-mono tracking-widest uppercase text-base sm:text-lg md:text-xl'
          style={{ color: "#7C3AED", textShadow: "0 0 10px rgba(124, 58, 237, 0.3)" }}
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
          style={{ color: "rgba(226, 232, 240, 0.7)" }}
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
          className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2 w-full sm:w-auto relative'
        >
          <button
            className='group w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-mono font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95'
            style={{
              backgroundColor: "#7C3AED",
              color: "#E2E8F0",
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 30px rgba(124, 58, 237, 0.6)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(124, 58, 237, 0.3)")}
            onClick={() => router.push("/game")}
          >
            Start Game
            <span className='ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1 font-bold'>
              →
            </span>
          </button>

          <button
            className='relative overflow-hidden group w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-mono font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95'
            style={{
              color: "#E2E8F0",
              border: "1px solid rgba(226, 232, 240, 0.1)",
              backgroundColor: "rgba(26, 26, 50, 0.3)",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F43F5E";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(244, 63, 94, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">How to Play</span>
            <span className="absolute inset-0 bg-[#F43F5E] transform scale-y-0 origin-bottom transition-transform duration-300 ease-out group-hover:scale-y-100 -z-0" />
          </button>
        </motion.div>

        {/* Stat row */}
        <motion.div
          variants={fadeUp}
          custom={0.55}
          initial='hidden'
          animate='visible'
          className='flex items-center gap-6 sm:gap-10 mt-6 font-mono text-sm sm:text-base'
          style={{ color: "rgba(226, 232, 240, 0.5)" }}
        >
          <motion.span 
            className='flex items-center gap-1.5'
            whileHover={{ scale: 1.05, color: "#A78BFA" }}
          >
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
              style={{ color: "#7C3AED" }}
            >
              <path d='M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z' />
              <path d='M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z' />
            </svg>
            Players
          </motion.span>
          <span
            className='w-px h-5'
            style={{ backgroundColor: "rgba(226, 232, 240, 0.15)" }}
          />
          <motion.span whileHover={{ scale: 1.05 }}>
            <span style={{ color: "#7C3AED" }} className='font-semibold'>
              Real-time
            </span>{" "}
            Updates
          </motion.span>
          <span
            className='w-px h-5'
            style={{ backgroundColor: "rgba(226, 232, 240, 0.15)" }}
          />
          <motion.span whileHover={{ scale: 1.05 }}>
            <span style={{ color: "#7C3AED" }} className='font-semibold'>
              1
            </span>{" "}
            Grid
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
