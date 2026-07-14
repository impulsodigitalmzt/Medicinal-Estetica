"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#A49673", "#C4B896", "#3E3A26", "#FDFBF7", "#D4AF37"];

type ConfettiBurstProps = {
  active: boolean;
};

export default function ConfettiBurst({ active }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<
    { id: number; x: number; delay: number; color: string; rotate: number }[]
  >([]);

  useEffect(() => {
    if (!active) return;
    setPieces(
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    );
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 h-2.5 w-1.5 rounded-sm"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            rotate: piece.rotate,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "110vh", opacity: [1, 1, 0] }}
          transition={{
            duration: 2.2,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
