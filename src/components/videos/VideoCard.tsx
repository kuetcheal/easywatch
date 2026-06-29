import { useEffect, useRef, useState } from "react";
import {
  selectIsFavorite,
  toggleFavorite,
  type FavoriteVideo,
} from "../../store/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type VideoCardProps = {
  video: FavoriteVideo;
  buildVideoUrl: (path?: string) => string;
  onClick: () => void;
  previewSeconds?: number;
};

const formatDuration = (seconds?: number | null): string => {
  if (!seconds && seconds !== 0) return "";

  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;

  return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

const formatViews = (views?: number): string => {
  const value = views || 0;

  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M vues`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K vues`;
  if (value <= 1) return `${value} vue`;

  return `${value} vues`;
};

export default function VideoCard({
  video,
  buildVideoUrl,
  onClick,
  previewSeconds = 8,
}: VideoCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, video));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [duration, setDuration] = useState<number | null>(null);

  const filePath =
    typeof video.filePath === "string"
      ? video.filePath
      : typeof video.videoUrl === "string"
      ? video.videoUrl
      : typeof video.url === "string"
      ? video.url
      : "";

  const poster =
    typeof video.thumbnailUrl === "string"
      ? video.thumbnailUrl
      : typeof video.poster === "string"
      ? video.poster
      : "";

  const startPreview = () => {
    const element = videoRef.current;
    if (!element) return;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      element.muted = true;
      element.playsInline = true;
      element.currentTime = 0;
    } catch {
      return;
    }

    const playPromise = element.play();

    if (playPromise?.catch) {
      playPromise.catch(() => undefined);
    }

    timerRef.current = window.setInterval(() => {
      if (element.currentTime >= previewSeconds) {
        element.pause();

        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 200);
  };

  const stopPreview = () => {
    const element = videoRef.current;
    if (!element) return;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    element.pause();

    try {
      element.currentTime = 0;
    } catch {
      return;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <article
      onClick={onClick}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-lg transition hover:-translate-y-1 hover:border-orange-500/70 hover:shadow-orange-500/10"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        <video
          ref={videoRef}
          src={buildVideoUrl(filePath)}
          poster={poster ? buildVideoUrl(poster) : undefined}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={(event) =>
            setDuration(event.currentTarget.duration)
          }
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase text-orange-500">
          18+
        </div>

        {duration !== null && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-white">
            {formatDuration(duration)}
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            dispatch(toggleFavorite(video));
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition ${
            isFavorite
              ? "border-orange-500 bg-orange-500 text-black"
              : "border-white/20 bg-black/70 text-white hover:border-orange-500 hover:text-orange-500"
          }`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-white">
          {video.title || "Sans titre"}
        </h3>

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{formatViews(Number(video.views || 0))}</span>
          <span className="rounded-full bg-white/5 px-2 py-1 text-orange-400">
            {typeof video.category === "string" ? video.category : "Vidéo"}
          </span>
        </div>
      </div>
    </article>
  );
}