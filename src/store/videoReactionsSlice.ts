import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type VideoKeySource =
  | string
  | number
  | {
      id?: string | number;
      _id?: string | number;
      filePath?: string;
      slug?: string;
      title?: string;
    }
  | null
  | undefined;

type VideoReaction = {
  liked: boolean;
  disliked: boolean;
};

type VideoReactionsState = {
  byId: Record<string, VideoReaction>;
};

const getVideoKey = (videoOrId: VideoKeySource): string | null => {
  if (!videoOrId) return null;

  if (typeof videoOrId === "string" || typeof videoOrId === "number") {
    return String(videoOrId);
  }

  const key =
    videoOrId.id ??
    videoOrId._id ??
    videoOrId.filePath ??
    videoOrId.slug ??
    videoOrId.title ??
    null;

  return key ? String(key) : null;
};

const initialState: VideoReactionsState = {
  byId: {},
};

const videoReactionsSlice = createSlice({
  name: "videoReactions",
  initialState,
  reducers: {
    setReactionsForVideo(
      state,
      action: PayloadAction<{
        video: VideoKeySource;
        liked: boolean;
        disliked: boolean;
      }>
    ) {
      const key = getVideoKey(action.payload.video);
      if (!key) return;

      state.byId[key] = {
        liked: Boolean(action.payload.liked),
        disliked: Boolean(action.payload.disliked),
      };
    },

    toggleLikeLocal(state, action: PayloadAction<VideoKeySource>) {
      const key = getVideoKey(action.payload);
      if (!key) return;

      const previous = state.byId[key] || {
        liked: false,
        disliked: false,
      };

      const newLiked = !previous.liked;

      state.byId[key] = {
        liked: newLiked,
        disliked: newLiked ? false : previous.disliked,
      };
    },

    toggleDislikeLocal(state, action: PayloadAction<VideoKeySource>) {
      const key = getVideoKey(action.payload);
      if (!key) return;

      const previous = state.byId[key] || {
        liked: false,
        disliked: false,
      };

      const newDisliked = !previous.disliked;

      state.byId[key] = {
        disliked: newDisliked,
        liked: newDisliked ? false : previous.liked,
      };
    },
  },
});

export const {
  setReactionsForVideo,
  toggleLikeLocal,
  toggleDislikeLocal,
} = videoReactionsSlice.actions;

export const selectReactionsForVideo = (
  state: { videoReactions: VideoReactionsState },
  videoOrId: VideoKeySource
): VideoReaction => {
  const key = getVideoKey(videoOrId);

  if (!key) {
    return {
      liked: false,
      disliked: false,
    };
  }

  return (
    state.videoReactions.byId[key] || {
      liked: false,
      disliked: false,
    }
  );
};

export default videoReactionsSlice.reducer;