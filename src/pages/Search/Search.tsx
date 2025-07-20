import { Box } from '@mui/material';
import { useMemo } from 'react';

import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../constants/Identifiers.ts';
import { QortalSearchParams, useAuth } from 'qapp-core';
import { useSearchParams } from 'react-router-dom';
import { useHomeState } from '../Home/Home-State.ts';
import VideoList from '../Home/Components/VideoList.tsx';
import { PageTransition } from '../../components/common/PageTransition.tsx';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query'); // "example"
  const mode = searchParams.get('mode'); // "example"

  // const page = searchParams.get('page'); // "2"
  console.log('query', query);
  const {
    tabValue,
    changeTab,
    filterName,
    filterCategory,
    subscriptions,
    filterType,
    filterSearch,
    filterSubCategory,
    isHydrated,
  } = useHomeState();

  const searchParameters: QortalSearchParams | null = useMemo(() => {
    if (!isHydrated) return null;
    const isSubscriptionTab = tabValue === 'subscriptions';
    const searchOptions: {
      description?: string;
      query?: string;
      names?: string[];
      name?: string;
    } = {};
    if (isSubscriptionTab) {
      searchOptions.names = subscriptions?.map((n) => n?.subscriberName);
    }
    if (filterCategory) {
      searchOptions.description = `category:${filterCategory.id};`;

      if (filterSubCategory)
        searchOptions.description += `subcategory:${filterSubCategory.id}`;
    }
    if (query) {
      searchOptions.query = query;
    }
    if (filterName) {
      searchOptions.name = filterName;
      delete searchOptions.names;
    }
    return {
      identifier:
        filterType === 'playlists' ? QTUBE_PLAYLIST_BASE : QTUBE_VIDEO_BASE,
      service: filterType === 'playlists' ? 'PLAYLIST' : 'DOCUMENT',
      offset: 0,
      reverse: true,
      limit: 20,
      ...searchOptions,
      mode: mode || 'ALL',
    };
  }, [
    filterType,
    filterName,
    filterCategory,
    filterSubCategory,
    query,
    mode,
    isHydrated,
    tabValue,
    subscriptions,
  ]);

  return (
    <PageTransition>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {searchParameters && (
            <VideoList
              listName="SearchedVideos"
              searchParameters={searchParameters}
            />
          )}
        </Box>
      </Box>
    </PageTransition>
  );
};
