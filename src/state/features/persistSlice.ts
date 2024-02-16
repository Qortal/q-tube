import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allTabValue, subscriptionTabValue } from "../../constants/Misc.ts";

type StretchVideoType = "contain" | "fill" | "cover" | "none" | "scale-down";
type SubscriptionListFilterType = "ALL" | "currentNameOnly";

export type SubscriptionObject = {
  userName: string;
  subscriberName: string;
};

interface settingsState {
  selectedTab: string;
  stretchVideoSetting: StretchVideoType;
  filterType: string;
  subscriptionList: SubscriptionObject[];
  playbackRate: number;
  subscriptionListFilter: SubscriptionListFilterType;
  showStats: boolean;
}

const initialState: settingsState = {
  selectedTab: allTabValue,
  stretchVideoSetting: "contain",
  filterType: "videos",
  subscriptionList: [],
  playbackRate: 1,
  subscriptionListFilter: "currentNameOnly",
  showStats: true,
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
    subscribe: (state, action: PayloadAction<SubscriptionObject>) => {
      const currentSubscriptions = state.subscriptionList;
      const notSubscribedToName =
        currentSubscriptions.find(item => {
          return item.subscriberName === action.payload.subscriberName;
        }) === undefined;
      if (notSubscribedToName) {
        state.subscriptionList = [...currentSubscriptions, action.payload];
      }
      console.log("subscribeList after subscribe: ", state.subscriptionList);
    },
    unSubscribe: (state, action: PayloadAction<SubscriptionObject>) => {
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
  },
});

export const {
  setHomePageSelectedTab,
  subscribe,
  unSubscribe,
  setReduxPlaybackRate,
  changeFilterType,
  resetSubscriptions,
} = persistSlice.actions;

export default persistSlice.reducer;
