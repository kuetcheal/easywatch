import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { videoApi } from "../api";
import AgeGate from "../components/common/AgeGate";
import SidebarLayout from "../components/layout/SidebarLayout";
import VideoCard from "../components/videos/VideoCard";
import type { FavoriteVideo } from "../store/favoritesSlice";

const PAGE_SIZE = 16;

type SortMode = "new" | "trending" | "mostViewed";

const normalizeVideosResponse = (data: unknown): FavoriteVideo[] => {
  if (Array.isArray(data)) return data as FavoriteVideo[];

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as { data?: unknown }).data)
  ) {
    return (data as { data: FavoriteVideo[] }).data;
  }

  return [];
};

const getVideoDate = (video: FavoriteVideo): number => {
  const createdAt = video.createdAt;

  if (typeof createdAt !== "string") return 0;

  return new Date(createdAt).getTime();
};

const getVideoCategory = (video: FavoriteVideo): string => {
  if (typeof video.category === "string") return video.category;

  if (
    typeof video.category === "object" &&
    video.category !== null &&
    "name" in video.category
  ) {
    return String((video.category as { name?: string }).name || "");
  }

  return "";
};

export default function Home() {
  const navigate = useNavigate();

  const [ageConfirmed, setAgeConfirmed] = useState(
    localStorage.getItem("easywatch_age_confirmed") === "true"
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortMode, setSortMode] = useState<SortMode>("new");

  const [videos, setVideos] = useState<FavoriteVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [errorVideos, setErrorVideos] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!ageConfirmed) return;

    const loadVideos = async () => {
      setLoadingVideos(true);
      setErrorVideos("");

      try {
        const response = await videoApi.getAll();
        const payload = normalizeVideosResponse(response.data);

        setVideos(payload);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement des vidéos.";

        setErrorVideos(message);
      } finally {
        setLoadingVideos(false);
      }
    };

    loadVideos();
  }, [ageConfirmed]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeCategory, sortMode]);

  const apiBase =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

  const buildVideoUrl = (path?: string): string => {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const filteredVideos = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    let result = [...videos];

    if (cleanSearch) {
      result = result.filter((video) =>
        String(video.title || "").toLowerCase().includes(cleanSearch)
      );
    }

    if (activeCategory !== "Tous") {
      result = result.filter((video) => {
        const category = getVideoCategory(video).toLowerCase();
        return category.includes(activeCategory.toLowerCase());
      });
    }

    if (sortMode === "new") {
      result.sort((a, b) => getVideoDate(b) - getVideoDate(a));
    }

    if (sortMode === "mostViewed") {
      result.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
    }

    if (sortMode === "trending") {
      result.sort((a, b) => {
        const scoreA = Number(a.views || 0) + getVideoDate(a) / 100000000;
        const scoreB = Number(b.views || 0) + getVideoDate(b) / 100000000;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [videos, search, activeCategory, sortMode]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredVideos.length;

  if (!ageConfirmed) {
    return <AgeGate onConfirm={() => setAgeConfirmed(true)} />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur lg:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              <span className="text-orange-500">Easy</span>Watch
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Espace vidéo réservé aux adultes.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {[
              { label: "Nouveautés", value: "new" },
              { label: "Tendances", value: "trending" },
              { label: "Les plus regardées", value: "mostViewed" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSortMode(tab.value as SortMode)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  sortMode === tab.value
                    ? "bg-orange-500 text-black"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="relative w-full xl:max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une vidéo..."
              className="h-12 w-full rounded-full border border-white/10 bg-zinc-950 px-5 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500">
              🔎
            </span>
          </div>
        </div>
      </header>

      <section className="px-4 py-6 lg:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
            Films adultes
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-black uppercase leading-tight sm:text-5xl">
            Découvrez les dernières vidéos ajoutées
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Parcourez les nouveautés, les tendances et vos contenus favoris dans
            une interface sombre, rapide et responsive.
          </p>
        </div>
      </section>

      <SidebarLayout
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      >
        {loadingVideos ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-950 text-zinc-300">
            Chargement des vidéos...
          </div>
        ) : errorVideos ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            Erreur API : {errorVideos}
          </div>
        ) : displayedVideos.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-950 text-center text-zinc-300">
            Aucune vidéo ne correspond à votre recherche.
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-400">
                {filteredVideos.length} vidéo
                {filteredVideos.length > 1 ? "s" : ""} trouvée
                {filteredVideos.length > 1 ? "s" : ""}
              </p>

              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                18+
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {displayedVideos.map((video) => (
                <VideoCard
                  key={String(video.id || video._id || video.filePath)}
                  video={video}
                  buildVideoUrl={buildVideoUrl}
                  onClick={() => navigate(`/video/${video.id || video._id}`)}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              {canLoadMore ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) =>
                      Math.min(current + PAGE_SIZE, filteredVideos.length)
                    )
                  }
                  className="rounded-full bg-orange-500 px-10 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-orange-400"
                >
                  Plus de vidéos
                </button>
              ) : (
                <p className="text-sm text-zinc-500">
                  Toutes les vidéos sont affichées.
                </p>
              )}
            </div>
          </>
        )}
      </SidebarLayout>
    </main>
  );
}