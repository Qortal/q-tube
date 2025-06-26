import React, { useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  setHomePageSelectedTab,
  VideoListType,
} from '../../state/features/persistSlice.ts';
import { RootState } from '../../state/store';
import { resetVideoState } from '../../state/features/videoSlice.ts';

export const useHomeState = (mode: string) => {
  const dispatch = useDispatch();
  const { filterType, selectedTab } = useSelector(
    (state: RootState) => state.persist
  );

  const [tabValue, setTabValue] = useState<VideoListType>(selectedTab);

  const {
    filterName,
    filterSearch,
    filterValue,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    filteredVideos,
    isFiltering,
    filteredSubscriptionList,
    videos: globalVideos,
  } = useSelector((state: RootState) => state.video);

  const isFilterMode = useRef(false);

  const videos = isFiltering ? filteredVideos : globalVideos;

  isFilterMode.current = !!isFiltering;

  const changeTab = (e: React.SyntheticEvent, newValue: VideoListType) => {
    setTabValue(newValue);
    dispatch(setHomePageSelectedTab(newValue));
  };

  const resetState = () => {
    dispatch(resetVideoState());
  };

  return {
    tabValue,
    changeTab,
    videos,
    filteredSubscriptionList,
    filterName,
    filterSearch,
    filterValue,
    filterType,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    resetState,
  };
};
