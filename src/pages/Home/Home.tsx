import { Box } from '@mui/material';
import { useMemo } from 'react';

import VideoList from './Components/VideoList.tsx';
import { useHomeState } from './Home-State.ts';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../constants/Identifiers.ts';
import { QortalSearchParams, useAuth } from 'qapp-core';
import { useSearchParams } from 'react-router-dom';
import { FilterOptions } from './FilterOptions.tsx';
import { ScrollToTopButton } from '../../components/common/ScrollToTopButton.tsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { scrollRefAtom } from '../../state/global/navbar.ts';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useAtomValue(scrollRefAtom);

  const query = searchParams.get('query'); // "example"
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
    filterMode,
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
    if (filterSearch) {
      searchOptions.query = filterSearch;
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
      mode: filterMode === 'recent' ? 'LATEST' : 'ALL',
    };
  }, [
    filterType,
    filterName,
    filterCategory,
    filterSubCategory,
    filterSearch,
    filterMode,
    isHydrated,
    tabValue,
    subscriptions,
  ]);

  console.log('searchParameters', searchParameters, isHydrated);

  return (
    <>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FilterOptions />
          {searchParameters && (
            <VideoList
              listName="latestVideos"
              searchParameters={searchParameters}
            />
          )}
        </Box>
      </Box>
      <ScrollToTopButton scrollRef={scrollRef} />
    </>
  );
};
