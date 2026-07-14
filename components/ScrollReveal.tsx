"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  offset?: number;
  /** Transición más lenta y suave, ideal para bloques de texto */
  gentle?: boolean;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  offset = 80,
  gentle = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once: true,
    amount: gentle ? 0.25 : 0.35,
    margin: gentle ? "0px 0px -5% 0px" : "0px 0px -10% 0px",
  });

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const hidden = { opacity: 0, x: offset };
  const visible = { opacity: 1, x: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={
        gentle
          ? {
              duration: 1.25,
              delay: isInView ? delay : 0,
              ease: [0.25, 0.1, 0.25, 1],
            }
          : {
              duration: 0.9,
              delay: isInView ? delay : 0,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {children}
    </motion.div>
  );
}
