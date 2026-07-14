"use client";

import {
  useRef,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const MAX_ROTATION = 10;

type Card3DProps = {
  children: ReactNode;
  className?: string;
};

export default function Card3D({ children, className = "" }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [MAX_ROTATION, -MAX_ROTATION]),
    { stiffness: 260, damping: 28 }
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-MAX_ROTATION, MAX_ROTATION]),
    { stiffness: 260, damping: 28 }
  );

  function updatePointer(clientX: number, clientY: number) {
    const element = ref.current;
    if (!element) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    pointerX.set((clientX - left) / width - 0.5);
    pointerY.set((clientY - top) / height - 0.5);
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    updatePointer(event.clientX, event.clientY);
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div className="h-full" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPointer}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetPointer}
        onTouchCancel={resetPointer}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`h-full will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
