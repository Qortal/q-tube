import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionData } from '../../components/common/ContentButtons/SubscribeButton.tsx';

interface GlobalState {
  videos: Video[];
}

const initialState: GlobalState = {
  videos: [],
};

export interface Video {
  title: string;
  description: string;
  created: number | string;
  user: string;
  service?: string;
  videoImage?: string;
  id: string;
  category?: string;
  categoryName?: string;
  tags?: string[];
  updated?: number | string;
  isValid?: boolean;
  code?: string;
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    blockUser: (state, action) => {
      const username = action.payload;

      state.videos = state.videos.filter((item) => item.user !== username);
    },
  },
});

export const { blockUser } = videoSlice.actions;

export default videoSlice.reducer;
