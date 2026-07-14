"use client";

import { motion, useReducedMotion } from "framer-motion";

type ChatBotLogoProps = {
  size?: number;
  /** When true: stop breathing and animate eyes (reading / processing). */
  isBotTyping?: boolean;
  className?: string;
};

/**
 * SupportBot mascot — top-left reference style.
 * Idle: subtle scale breathing. Typing: eyes scan up/down ×3.
 */
export default function ChatBotLogo({
  size = 40,
  isBotTyping = false,
  className = "",
}: ChatBotLogoProps) {
  const reduceMotion = useReducedMotion();
  const idle = !isBotTyping && !reduceMotion;
  const typing = isBotTyping && !reduceMotion;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      animate={
        reduceMotion
          ? { scale: 1 }
          : idle
            ? { scale: [1, 1.05, 1] }
            : { scale: 1 }
      }
      transition={
        idle
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.25 }
      }
    >
      {/* —— Head shell (light L / shadowed R) —— */}
      <path
        d="M14 18c0-8.5 7.5-15.5 18-15.5S50 9.5 50 18v14c0 8.5-7.5 14.5-18 14.5S14 40.5 14 32V18Z"
        fill="#E6E9ED"
      />
      <path
        d="M32 2.5C42.5 2.5 50 9.5 50 18v14c0 8.5-7.5 14.5-18 14.5V2.5Z"
        fill="#C5CCD4"
      />

      {/* Antennae / ears */}
      <ellipse cx="18.5" cy="8" rx="4.2" ry="5.2" fill="#E6E9ED" />
      <ellipse cx="45.5" cy="8" rx="4.2" ry="5.2" fill="#C5CCD4" />

      {/* Faceplate */}
      <path
        d="M20 20.5c0-4.2 5.4-7.5 12-7.5s12 3.3 12 7.5v10.5c0 4.2-5.4 7.5-12 7.5s-12-3.3-12-7.5V20.5Z"
        fill="#2A3138"
      />
      <path
        d="M32 13c6.6 0 12 3.3 12 7.5v10.5c0 4.2-5.4 7.5-12 7.5V13Z"
        fill="#1E2429"
      />

      {/* Eyes — Y offset when typing (scan ×3) */}
      <motion.g
        animate={
          typing
            ? { y: [0, -2.4, 2.2, -2.4, 2.2, -2.4, 2.2, 0] }
            : { y: 0 }
        }
        transition={
          typing
            ? { duration: 1.35, ease: "easeInOut", times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1] }
            : { duration: 0.3, ease: "easeOut" }
        }
      >
        {/* Left eye */}
        <circle cx="26.5" cy="24.5" r="4.4" fill="#00E5F0" />
        <circle cx="26.5" cy="24.5" r="3.2" fill="#00C8D6" />
        <circle cx="28" cy="23.2" r="1.15" fill="#FFFFFF" />
        <circle cx="25.4" cy="25.8" r="0.55" fill="#FFFFFF" opacity="0.7" />

        {/* Right eye */}
        <circle cx="37.5" cy="24.5" r="4.4" fill="#00E5F0" />
        <circle cx="37.5" cy="24.5" r="3.2" fill="#00C8D6" />
        <circle cx="39" cy="23.2" r="1.15" fill="#FFFFFF" />
        <circle cx="36.4" cy="25.8" r="0.55" fill="#FFFFFF" opacity="0.7" />
      </motion.g>

      {/* Smile */}
      <path
        d="M29.5 31.2c1.2 1.4 3.8 1.4 5 0"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Floating torso */}
      <path
        d="M27 52.5c0-5.2 2.2-9.5 5-9.5s5 4.3 5 9.5c0 2.8-2.2 4.5-5 4.5s-5-1.7-5-4.5Z"
        fill="#E6E9ED"
      />
      <path
        d="M32 43c2.8 0 5 4.3 5 9.5 0 2.8-2.2 4.5-5 4.5V43Z"
        fill="#C5CCD4"
      />
      {/* Side fins */}
      <ellipse cx="24.5" cy="50" rx="3.2" ry="2.4" fill="#E6E9ED" />
      <ellipse cx="39.5" cy="50" rx="3.2" ry="2.4" fill="#C5CCD4" />
      {/* Chest accent */}
      <circle cx="32" cy="50.5" r="1.6" fill="#00D4E0" />
    </motion.svg>
  );
}
