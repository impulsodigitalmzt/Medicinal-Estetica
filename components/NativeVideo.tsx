"use client";

import { useEffect, useRef } from "react";

type NativeVideoProps = {
  src: string;
  title: string;
  className?: string;
  /** Vertical clinical reels fill better with cover. */
  fit?: "cover" | "contain";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

/**
 * Native MP4 with reliable autoplay.
 * Browsers require muted + playsInline; React's muted prop alone is often ignored.
 */
export default function NativeVideo({
  src,
  title,
  className = "",
  fit = "cover",
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true,
}: NativeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    video.defaultMuted = muted;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (muted) video.setAttribute("muted", "");

    if (!autoPlay) return;

    const tryPlay = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            /* Autoplay blocked until visible / muted — retry on events. */
          });
        }
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            video.pause();
          }
        },
        { threshold: 0.2, rootMargin: "80px" }
      );
      observer.observe(video);
    }

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [autoPlay, muted, src]);

  return (
    <video
      ref={videoRef}
      className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
      src={src}
      title={title}
      aria-label={title}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      preload="auto"
    />
  );
}
