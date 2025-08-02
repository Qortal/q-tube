import React from 'react';

import { QTUBE_VIDEO_BASE } from '../constants/Identifiers.ts';
import { useSetAtom } from 'jotai';
import {
  totalNamesPublishedAtom,
  totalVideosPublishedAtom,
  videosPerNamePublishedAtom,
} from '../state/global/stats.ts';

export const useFetchVideos = () => {
  const setTotalVideosPublished = useSetAtom(totalVideosPublishedAtom);
  const setTotalNamesPublished = useSetAtom(totalNamesPublishedAtom);
  const setVideosPerNamePublished = useSetAtom(videosPerNamePublishedAtom);
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

      setTotalVideosPublished(responseData.length);
      const uniqueNames = new Set(responseData.map((video) => video.name));
      setTotalNamesPublished(uniqueNames.size);
      setVideosPerNamePublished(responseData.length / uniqueNames.size);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    getVideosCount,
  };
};
