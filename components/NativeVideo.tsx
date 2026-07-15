"use client";

import { useCallback } from "react";

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
 * Native MP4 with reliable muted autoplay.
 * Sets muted on the DOM node immediately (React's muted prop alone is unreliable).
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
  const videoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;

      // Must be set synchronously so the browser allows autoplay.
      video.defaultMuted = muted;
      video.muted = muted;
      video.playsInline = true;

      if (!autoPlay) return;

      const play = () => {
        void video.play().catch(() => {});
      };

      play();

      if (video.readyState < 2) {
        video.addEventListener("loadeddata", play, { once: true });
        video.addEventListener("canplay", play, { once: true });
      }
    },
    [autoPlay, muted, src]
  );

  return (
    <video
      key={src}
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
      preload={autoPlay ? "auto" : "metadata"}
      disableRemotePlayback
    />
  );
}
