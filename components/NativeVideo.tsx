"use client";

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
  return (
    <video
      className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
      src={src}
      title={title}
      aria-label={title}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      preload="metadata"
    />
  );
}
