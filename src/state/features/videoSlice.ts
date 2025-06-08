import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionData } from "../../components/common/ContentButtons/SubscribeButton.tsx";

interface GlobalState {
  videos: Video[];
  filteredVideos: Video[];
  hashMapVideos: Record<string, Video>;
  hashMapSuperlikes: Record<string, any>;
  countNewVideos: number;
  isFiltering: boolean;
  filterValue: string;
  filterSearch: string;
  filterName: string;
  selectedCategoryVideos: any;
  selectedSubCategoryVideos: any;
  editVideoProperties: any;
  editPlaylistProperties: any;
  filteredSubscriptionList: SubscriptionData[];
}

const initialState: GlobalState = {
  videos: [],
  filteredVideos: [],
  hashMapVideos: {},
  hashMapSuperlikes: {},
  countNewVideos: 0,
  isFiltering: false,
  filterValue: "",
  filterSearch: "",
  filterName: "",
  selectedCategoryVideos: null,
  selectedSubCategoryVideos: null,
  editVideoProperties: null,
  editPlaylistProperties: null,
  filteredSubscriptionList: [],
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
  name: "video",
  initialState,
  reducers: {
    setEditVideo: (state, action) => {
      state.editVideoProperties = action.payload;
    },
    setEditPlaylist: (state, action) => {
      state.editPlaylistProperties = action.payload;
    },

    changefilterSearch: (state, action) => {
      state.filterSearch = action.payload;
    },
    changefilterName: (state, action) => {
      state.filterName = action.payload;
    },
    changeSelectedCategoryVideos: (state, action) => {
      state.selectedCategoryVideos = action.payload;
    },
    changeSelectedSubCategoryVideos: (state, action) => {
      state.selectedSubCategoryVideos = action.payload;
    },
    setCountNewVideos: (state, action) => {
      state.countNewVideos = action.payload;
    },
    addVideos: (state, action) => {
      state.videos = action.payload;
    },
    addFilteredVideos: (state, action) => {
      state.filteredVideos = action.payload;
    },
    removeVideo: (state, action) => {
      const idToDelete = action.payload;
      state.videos = state.videos.filter(item => item.id !== idToDelete);
      state.filteredVideos = state.filteredVideos.filter(
        item => item.id !== idToDelete
      );
    },
    addVideoToBeginning: (state, action) => {
      state.videos.unshift(action.payload);
    },
    clearVideoList: state => {
      state.videos = [];
    },
    updateVideo: (state, action) => {
      const { id } = action.payload;
      const index = state.videos.findIndex(video => video.id === id);
      if (index !== -1) {
        state.videos[index] = { ...action.payload };
      }
      const index2 = state.filteredVideos.findIndex(video => video.id === id);
      if (index2 !== -1) {
        state.filteredVideos[index2] = { ...action.payload };
      }
    },
    addToHashMap: (state, action) => {
      const video = action.payload;
      state.hashMapVideos[video.id + "-" + video.user] = video;
    },
    addtoHashMapSuperlikes: (state, action) => {
      const superlike = action.payload;
      state.hashMapSuperlikes[superlike.identifier] = superlike;
    },
    updateInHashMap: (state, action) => {
      const { id, user } = action.payload;
      const video = action.payload;
      state.hashMapVideos[id + "-" + user] = { ...video };
    },
    removeFromHashMap: (state, action) => {
      const idToDelete = action.payload;
      delete state.hashMapVideos[idToDelete];
    },
    addArrayToHashMap: (state, action) => {
      const videos = action.payload;
      videos.forEach((video: Video) => {
        state.hashMapVideos[video.id + "-" + video.user] = video;
      });
    },
    upsertVideos: (state, action) => {
      action.payload.forEach((video: Video) => {
        const index = state.videos.findIndex(p => p.id === video.id);
        if (index !== -1) {
          state.videos[index] = video;
        } else {
          state.videos.push(video);
        }
      });
    },
    upsertFilteredVideos: (state, action) => {
      action.payload.forEach((video: Video) => {
        const index = state.filteredVideos.findIndex(p => p.id === video.id);
        if (index !== -1) {
          state.filteredVideos[index] = video;
        } else {
          state.filteredVideos.push(video);
        }
      });
    },
    upsertVideosBeginning: (state, action) => {
      action.payload.reverse().forEach((video: Video) => {
        const index = state.videos.findIndex(p => p.id === video.id);
        if (index !== -1) {
          state.videos[index] = video;
        } else {
          state.videos.unshift(video);
        }
      });
    },
    setIsFiltering: (state, action) => {
      state.isFiltering = action.payload;
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    blockUser: (state, action) => {
      const username = action.payload;

      state.videos = state.videos.filter(item => item.user !== username);
    },

    setFilteredSubscriptions: (
      state,
      action: PayloadAction<SubscriptionData[]>
    ) => {
      state.filteredSubscriptionList = action.payload;
    },
    resetVideoState: () => initialState, 

  },
});

export const {
  setCountNewVideos,
  addVideos,
  addFilteredVideos,
  removeVideo,
  addVideoToBeginning,
  updateVideo,
  addToHashMap,
  updateInHashMap,
  removeFromHashMap,
  addArrayToHashMap,
  upsertVideos,
  upsertFilteredVideos,
  upsertVideosBeginning,
  setIsFiltering,
  setFilterValue,
  clearVideoList,
  changefilterSearch,
  changefilterName,
  changeSelectedCategoryVideos,
  changeSelectedSubCategoryVideos,
  blockUser,
  setEditVideo,
  setEditPlaylist,
  addtoHashMapSuperlikes,
  setFilteredSubscriptions,
  resetVideoState
} = videoSlice.actions;

export default videoSlice.reducer;
