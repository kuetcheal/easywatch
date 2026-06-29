import { configureStore } from "@reduxjs/toolkit";

import favoritesReducer from "./favoritesSlice";
import videoReactionsReducer from "./videoReactionsSlice";

const FAVORITES_STORAGE_KEY = "easywatch_favorites_v1";

const loadFavoritesFromStorage = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    videoReactions: videoReactionsReducer,
  },
  preloadedState: {
    favorites: {
      items: loadFavoritesFromStorage(),
    },
  },
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(state.favorites.items)
    );
  } catch {
    console.warn("Impossible de sauvegarder les favoris.");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;