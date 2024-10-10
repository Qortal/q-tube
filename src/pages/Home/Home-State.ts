import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useFetchVideos } from "../../hooks/useFetchVideos.tsx";
import {
  setHomePageSelectedTab,
  VideoListType,
} from "../../state/features/persistSlice.ts";
import { RootState } from "../../state/store";

export const useHomeState = (mode: string) => {
  const dispatch = useDispatch();
  const { filterType, selectedTab } = useSelector(
    (state: RootState) => state.persist
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const firstFetch = useRef(false);
  const afterFetch = useRef(false);
  const isFetching = useRef(false);

  const { getVideos, getVideosFiltered } = useFetchVideos();

  const videos = isFiltering ? filteredVideos : globalVideos;

  isFilterMode.current = !!isFiltering;

  const changeTab = (e: React.SyntheticEvent, newValue: VideoListType) => {
    setTabValue(newValue);
    dispatch(setHomePageSelectedTab(newValue));
  };

  const getVideosHandlerMount = React.useCallback(async () => {
    if (firstFetch.current) return;
    firstFetch.current = true;
    setIsLoading(true);
    await getVideos(
      {
        name: "",
        category: "",
        subcategory: "",
        keywords: "",
        contentType: filterType,
      },
      null,
      null,
      20,
      tabValue
    );
    afterFetch.current = true;
    isFetching.current = false;

    setIsLoading(false);
  }, [getVideos]);

  const getVideosHandler = React.useCallback(
    async (reset?: boolean, resetFilters?: boolean) => {
      if (!firstFetch.current || !afterFetch.current) return;
      if (isFetching.current) return;
      isFetching.current = true;

      await getVideos(
        {
          name: filterName,
          category: selectedCategoryVideos?.id,
          subcategory: selectedSubCategoryVideos?.id,
          keywords: filterSearch,
          contentType: filterType,
        },
        reset,
        resetFilters,
        20,
        tabValue
      );
      isFetching.current = false;
    },
    [
      getVideos,
      filterValue,
      getVideosFiltered,
      isFiltering,
      filterName,
      selectedCategoryVideos,
      selectedSubCategoryVideos,
      filterSearch,
      filterType,
      tabValue,
    ]
  );

  useEffect(() => {
    getVideosHandler(true);
  }, [tabValue]);
  const prevVal = useRef("");

  useEffect(() => {
    if (isFiltering && filterValue !== prevVal?.current) {
      prevVal.current = filterValue;

      getVideosHandler();
    }
  }, [filterValue, isFiltering, filteredVideos]);

  useEffect(() => {
    if (
      !firstFetch.current &&
      !isFilterMode.current &&
      globalVideos.length === 0
    ) {
      isFetching.current = true;
      getVideosHandlerMount();
    } else {
      firstFetch.current = true;
      afterFetch.current = true;
    }
  }, [getVideosHandlerMount, globalVideos]);

  return {
    tabValue,
    changeTab,
    videos,
    isLoading,
    filteredSubscriptionList,
    getVideosHandler,
  };
};
