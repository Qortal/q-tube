import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionData } from "../../components/common/ContentButtons/SubscribeButton.tsx";

export type StretchVideoType =
  | "contain"
  | "fill"
  | "cover"
  | "none"
  | "scale-down";
export type SubscriptionListFilterType = "ALL" | "currentNameOnly";
export type ContentType = "videos" | "playlists";
export type VideoListType = "all" | "subscriptions";
interface settingsState {
  selectedTab: VideoListType;
  stretchVideoSetting: StretchVideoType;
  filterType: ContentType;
  subscriptionList: SubscriptionData[];
  playbackRate: number;
  subscriptionListFilter: SubscriptionListFilterType;
  showStats: boolean;
  volume: number;
  mutedVolume: number;
  isMuted: boolean;
  alwaysShowControls: boolean;
}

const initialState: settingsState = {
  selectedTab: "all",
  stretchVideoSetting: "contain",
  filterType: "videos",
  subscriptionList: [],
  playbackRate: 1,
  subscriptionListFilter: "currentNameOnly",
  showStats: true,
  volume: 0.5,
  mutedVolume: 0,
  isMuted: false,
  alwaysShowControls: false,
};

export const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setHomePageSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setStretchVideoSetting: (state, action) => {
      state.stretchVideoSetting = action.payload;
    },
    setShowStats: (state, action) => {
      state.showStats = action.payload;
    },
    subscribe: (state, action: PayloadAction<SubscriptionData>) => {
      const currentSubscriptions = state.subscriptionList;
      const notSubscribedToName =
        currentSubscriptions.find(item => {
          return (
            item.subscriberName === action.payload.subscriberName &&
            item.userName === action.payload.userName
          );
        }) === undefined;
      if (notSubscribedToName) {
        state.subscriptionList = [...currentSubscriptions, action.payload];
      }
      console.log("subscribeList after subscribe: ", state.subscriptionList);
    },
    unSubscribe: (state, action: PayloadAction<SubscriptionData>) => {
      state.subscriptionList = state.subscriptionList.filter(
        item => item.subscriberName !== action.payload.subscriberName
      );
      console.log("subscribeList after unsubscribe: ", state.subscriptionList);
    },
    resetSubscriptions: state => {
      state.subscriptionList = [];
    },
    setReduxPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
    changeFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setVolumeSetting: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setMutedVolumeSetting: (state, action: PayloadAction<number>) => {
      state.mutedVolume = action.payload;
    },
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setAlwaysShowControls: (state, action: PayloadAction<boolean>) => {
      state.alwaysShowControls = action.payload;
    },
  },
});

export const {
  setHomePageSelectedTab,
  setStretchVideoSetting,
  subscribe,
  unSubscribe,
  setReduxPlaybackRate,
  changeFilterType,
  resetSubscriptions,
  setVolumeSetting,
  setMutedVolumeSetting,
  setIsMuted,
  setAlwaysShowControls,
} = persistSlice.actions;

export default persistSlice.reducer;
