import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FavoriteVideo = {
  id?: string | number;
  _id?: string | number;
  title?: string;
  filePath?: string;
  videoUrl?: string;
  url?: string;
  slug?: string;
  thumbnailUrl?: string;
  poster?: string;
  views?: number;
  category?: string;
  _favKey?: string;
  [key: string]: unknown;
};

type FavoritesState = {
  items: FavoriteVideo[];
};

const getVideoKey = (video?: FavoriteVideo | null): string | null => {
  if (!video) return null;

  const key =
    video.id ??
    video._id ??
    video.filePath ??
    video.slug ??
    video.title ??
    null;

  return key ? String(key) : null;
};

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<FavoriteVideo>) {
      const video = action.payload;
      const key = getVideoKey(video);

      if (!key) return;

      const index = state.items.findIndex((item) => item._favKey === key);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          ...video,
          _favKey: key,
        });
      }
    },

    setFavorites(state, action: PayloadAction<FavoriteVideo[]>) {
      state.items = action.payload || [];
    },

    clearFavorites(state) {
      state.items = [];
    },
  },
});

export const { toggleFavorite, setFavorites, clearFavorites } =
  favoritesSlice.actions;

export const selectIsFavorite = (
  state: { favorites: FavoritesState },
  video: FavoriteVideo
): boolean => {
  const key = getVideoKey(video);
  if (!key) return false;

  return state.favorites.items.some((item) => item._favKey === key);
};

export default favoritesSlice.reducer;