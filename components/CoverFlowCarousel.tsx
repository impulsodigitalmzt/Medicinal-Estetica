"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type CoverFlowCarouselProps<T extends { id: string }> = {
  items: T[];
  renderItem: (item: T, isActive: boolean) => ReactNode;
  getLabel?: (item: T) => string;
  autoplay?: boolean;
  autoplayDelay?: number;
  theme?: "light" | "dark";
  className?: string;
  ariaLabel?: string;
};

const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

function getCardMotion(offset: number, reducedMotion: boolean, spacing: number) {
  const absOffset = Math.abs(offset);
  const allowNeighborClick = spacing >= 240;
  const pointerEvents = (
    offset === 0 || (allowNeighborClick && absOffset <= 1) ? "auto" : "none"
  ) as "auto" | "none";

  if (absOffset > 2) {
    return {
      opacity: 0,
      scale: 0.75,
      x: offset * 180,
      rotateY: 0,
      z: -200,
      filter: "blur(6px)",
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  }

  if (reducedMotion) {
    return {
      opacity: offset === 0 ? 1 : 0.35,
      scale: offset === 0 ? 1 : 0.92,
      x: offset * 40,
      rotateY: 0,
      z: 0,
      filter: "blur(0px)",
      zIndex: 10 - absOffset,
      pointerEvents,
    };
  }

  return {
    opacity: offset === 0 ? 1 : absOffset === 1 ? 0.72 : 0.4,
    scale: offset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.68,
    x: offset * spacing,
    rotateY: offset * -38,
    z: -absOffset * 110,
    filter: offset === 0 ? "blur(0px)" : `blur(${absOffset * 1.5}px)`,
    zIndex: 10 - absOffset,
    pointerEvents,
  };
}

function useCoverFlowSpacing() {
  const [spacing, setSpacing] = useState(280);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 480) setSpacing(130);
      else if (width < 640) setSpacing(170);
      else setSpacing(280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return spacing;
}

export default function CoverFlowCarousel<T extends { id: string }>({
  items,
  renderItem,
  getLabel,
  autoplay = true,
  autoplayDelay = 4500,
  theme = "dark",
  className = "",
  ariaLabel = "Carrusel",
}: CoverFlowCarouselProps<T>) {
  const isDark = theme === "dark";
  const reducedMotion = useReducedMotion();
  const spacing = useCoverFlowSpacing();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoplay || reducedMotion || isPaused || total <= 1) return;
    const timer = window.setInterval(goNext, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, goNext, isPaused, reducedMotion, total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (total === 0) return null;

  return (
    <div
      className={`relative select-none overflow-x-hidden ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className="relative mx-auto h-[min(68vw,400px)] max-h-[440px] min-h-[300px] w-full max-w-5xl touch-pan-y overflow-hidden sm:h-[400px] md:h-[440px]"
        style={{ perspective: reducedMotion ? undefined : "1400px" }}
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
          isDragging.current = false;
        }}
        onPointerMove={(event) => {
          if (Math.abs(event.clientX - dragStartX.current) > 8) {
            isDragging.current = true;
          }
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - dragStartX.current;
          if (Math.abs(delta) > 60) {
            if (delta > 0) goPrev();
            else goNext();
          }
          window.setTimeout(() => {
            isDragging.current = false;
          }, 0);
        }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: reducedMotion ? undefined : "preserve-3d" }}
        >
          {items.map((item, index) => {
            const offset = getWrappedOffset(index, activeIndex, total);
            const isActive = offset === 0;
            const cardMotion = getCardMotion(
              offset,
              Boolean(reducedMotion),
              spacing,
            );

            return (
              <motion.div
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[min(88vw,340px)] sm:w-[360px] md:w-[400px]"
                style={{
                  transformStyle: reducedMotion ? undefined : "preserve-3d",
                  zIndex: cardMotion.zIndex,
                  pointerEvents: cardMotion.pointerEvents,
                }}
                initial={false}
                animate={{
                  x: `calc(-50% + ${cardMotion.x}px)`,
                  y: "-50%",
                  translateZ: cardMotion.z,
                  rotateY: cardMotion.rotateY,
                  scale: cardMotion.scale,
                  opacity: cardMotion.opacity,
                  filter: cardMotion.filter,
                }}
                transition={reducedMotion ? { duration: 0.2 } : springTransition}
                onClick={() => {
                  if (isDragging.current || isActive) return;
                  goTo(index);
                }}
                aria-hidden={!isActive}
              >
                <div
                  className={`relative rounded-serenity-lg transition-shadow duration-500 ${
                    isActive
                      ? "shadow-[0_0_0_1px_rgba(92,107,79,0.35),0_12px_48px_rgba(92,107,79,0.18),0_24px_64px_rgba(0,0,0,0.25)]"
                      : "shadow-lg"
                  }`}
                >
                  {renderItem(item, isActive)}

                  {isActive && !reducedMotion ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-[90%] -translate-x-1/2 scale-y-[-1] opacity-25 blur-md"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(247,245,240,0.2), transparent)",
                        maskImage: "linear-gradient(to bottom, black, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black, transparent)",
                      }}
                    />
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className={`absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-pill border p-2.5 shadow-md backdrop-blur-sm transition-colors md:inline-flex ${
                isDark
                  ? "border-white/20 bg-luxury-bg/10 text-luxury-bg hover:bg-luxury-bg/20"
                  : "border-luxury-accent/25 bg-luxury-bg/90 text-luxury-dark hover:bg-white"
              }`}
              aria-label="Testimonio anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={`absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-pill border p-2.5 shadow-md backdrop-blur-sm transition-colors md:inline-flex ${
                isDark
                  ? "border-white/20 bg-luxury-bg/10 text-luxury-bg hover:bg-luxury-bg/20"
                  : "border-luxury-accent/25 bg-luxury-bg/90 text-luxury-dark hover:bg-white"
              }`}
              aria-label="Siguiente testimonio"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Seleccionar testimonio"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const label = getLabel?.(item) ?? `Elemento ${index + 1}`;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={label}
                onClick={() => goTo(index)}
                className={`min-h-11 rounded-pill px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
                  isActive
                    ? "bg-luxury-accent text-luxury-bg shadow-sm"
                    : isDark
                      ? "border border-white/20 bg-white/10 text-luxury-bg/70 hover:border-luxury-accent/50 hover:text-luxury-bg"
                      : "border border-luxury-accent/25 bg-luxury-bg text-luxury-text/70 hover:border-luxury-accent/50 hover:text-luxury-dark"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
