import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subscriptionTabValue } from "../../constants/Misc.ts";

type StretchVideoType = "contain" | "fill" | "cover" | "none" | "scale-down";
interface settingsState {
  selectedTab: string;
  stretchVideoSetting: StretchVideoType;
}

const initialState: settingsState = {
  selectedTab: subscriptionTabValue,
  stretchVideoSetting: "contain",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setHomePageSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setStretchVideoSetting: (state, action) => {
      state.stretchVideoSetting = action.payload;
    },
  },
});

export const { setHomePageSelectedTab } = settingsSlice.actions;

export default settingsSlice.reducer;
