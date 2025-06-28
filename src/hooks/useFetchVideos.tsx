import React from 'react';

import {
  totalNamesPublished,
  totalVideosPublished,
  videosPerNamePublished,
} from '../components/StatsData.tsx';

import { QTUBE_VIDEO_BASE } from '../constants/Identifiers.ts';

export const useFetchVideos = () => {
  const getVideosCount = React.useCallback(async () => {
    try {
      const url = `/arbitrary/resources/search?mode=ALL&includemetadata=false&limit=0&service=DOCUMENT&identifier=${QTUBE_VIDEO_BASE}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();

      totalVideosPublished.value = responseData.length;
      const uniqueNames = new Set(responseData.map((video) => video.name));
      totalNamesPublished.value = uniqueNames.size;
      videosPerNamePublished.value =
        totalVideosPublished.value / totalNamesPublished.value;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    getVideosCount,
  };
};
