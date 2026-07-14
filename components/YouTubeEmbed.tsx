"use client";

import { useEffect, useRef } from "react";

type YouTubePlayer = {
  destroy: () => void;
  mute?: () => void;
  playVideo?: () => void;
  getAvailableQualityLevels?: () => string[];
  setPlaybackQuality: (quality: string) => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
  data?: number;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
  };
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  /** Autoplay muted (required by browsers). */
  autoplay?: boolean;
};

let apiLoading: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return apiLoading;
}

function requestBestQuality(player: YouTubePlayer) {
  try {
    const qualities = player.getAvailableQualityLevels?.() ?? [];
    const preferred = ["hd1080", "hd720", "large", "medium"];

    for (const quality of preferred) {
      if (qualities.includes(quality)) {
        player.setPlaybackQuality(quality);
        break;
      }
    }
  } catch {
    // YouTube controls final quality based on device and connection.
  }
}

export default function YouTubeEmbed({
  videoId,
  title,
  className = "max-w-5xl",
  autoplay = false,
}: YouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
          ...(autoplay
            ? { autoplay: 1, mute: 1, controls: 1, loop: 1, playlist: videoId }
            : {}),
        },
        events: {
          onReady: (event) => {
            requestBestQuality(event.target);
            if (autoplay) {
              event.target.mute?.();
              event.target.playVideo?.();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) {
              requestBestQuality(event.target);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, autoplay]);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-serenity-lg border border-luxury-accent/20 bg-luxury-dark shadow-serenity ${className}`}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        title={title}
        aria-label={title}
      />
    </div>
  );
}
