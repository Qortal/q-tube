import { createSlice } from "@reduxjs/toolkit";

interface GlobalState {
  isLoadingGlobal: boolean;
  downloads: any;
  userAvatarHash: Record<string, string>;
  publishNames: string[] | null;
  videoPlaying: any | null;
  superlikelistAll: any[];
}
const initialState: GlobalState = {
  isLoadingGlobal: false,
  downloads: {},
  userAvatarHash: {},
  publishNames: null,
  videoPlaying: null,
  superlikelistAll: [],
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsLoadingGlobal: (state, action) => {
      state.isLoadingGlobal = action.payload;
    },
    setAddToDownloads: (state, action) => {
      const download = action.payload;
      state.downloads[download.identifier] = download;
    },
    updateDownloads: (state, action) => {
      const { identifier } = action.payload;
      const download = action.payload;
      state.downloads[identifier] = {
        ...state.downloads[identifier],
        ...download,
      };
    },
    setUserAvatarHash: (state, action) => {
      const avatar = action.payload;
      if (avatar?.name && avatar?.url) {
        state.userAvatarHash[avatar?.name] = avatar?.url;
      }
    },
    addPublishNames: (state, action) => {
      state.publishNames = action.payload;
    },
    setVideoPlaying: (state, action) => {
      state.videoPlaying = action.payload;
    },
    setSuperlikesAll: (state, action) => {
      state.superlikelistAll = action.payload;
    },
  },
});

export const {
  setIsLoadingGlobal,
  setAddToDownloads,
  updateDownloads,
  setUserAvatarHash,
  addPublishNames,
  setVideoPlaying,
  setSuperlikesAll,
} = globalSlice.actions;

export default globalSlice.reducer;
