import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subscriptionTabValue } from "../../constants/Misc.ts";

type StretchVideoType = "contain" | "fill" | "cover" | "none" | "scale-down";
interface settingsState {
  selectedTab: string;
  stretchVideoSetting: StretchVideoType;
  filterType: string;
  subscriptionList: string[];
  playbackRate: number;
}

const initialState: settingsState = {
  selectedTab: subscriptionTabValue,
  stretchVideoSetting: "contain",
  filterType: "videos",
  subscriptionList: [],
  playbackRate: 1,
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
    subscribe: (state, action: PayloadAction<string>) => {
      const currentSubscriptions = state.subscriptionList;
      if (!currentSubscriptions.includes(action.payload)) {
        state.subscriptionList = [...currentSubscriptions, action.payload];
      }
    },
    unSubscribe: (state, action) => {
      state.subscriptionList = state.subscriptionList.filter(
        item => item !== action.payload
      );
    },
    setReduxPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
    changeFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
});

export const {
  setHomePageSelectedTab,
  subscribe,
  unSubscribe,
  setReduxPlaybackRate,
  changeFilterType,
} = persistSlice.actions;

export default persistSlice.reducer;
