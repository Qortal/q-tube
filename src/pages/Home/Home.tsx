import { TabContext, TabList, TabPanel } from '@mui/lab';

import { Box, Tab, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { ListSuperLikeContainer } from '../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx';
import { fontSizeLarge, fontSizeSmall } from '../../constants/Misc.ts';
import { SearchSidebar } from './Components/SearchSidebar.tsx';
import VideoList from './Components/VideoList.tsx';
import { useHomeState } from './Home-State.ts';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../constants/Identifiers.ts';
import { QortalSearchParams, useAuth } from 'qapp-core';

export const Home = () => {
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

  const tabPaneSX = {
    width: '100%',
    paddingLeft: '0px',
    paddingRight: '0px',
  };
  const isScreenSmall = !useMediaQuery('(min-width:600px)');
  const isScreenLarge = useMediaQuery('(min-width:1200px)');

  const tabSX = {
    fontSize: isScreenSmall ? fontSizeSmall : fontSizeLarge,
    paddingLeft: '0px',
    paddingRight: '0px',
  };

  const homeBaseSX = { display: 'grid', width: '100%' };
  const bigGridSX = { gridTemplateColumns: '200px auto 250px' };
  const mediumGridSX = { gridTemplateColumns: '200px auto' };
  const smallGridSX = { gridTemplateColumns: '100%', gap: '20px' };

  let homeColumns: object;
  if (isScreenLarge) homeColumns = bigGridSX;
  else if (!isScreenSmall) homeColumns = mediumGridSX;
  else homeColumns = smallGridSX;

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
      searchOptions.names = subscriptions?.map((n) => n.subscriberName);
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
      mode: 'ALL',
    };
  }, [
    filterType,
    filterName,
    filterCategory,
    filterSubCategory,
    filterSearch,
    isHydrated,
    tabValue,
    subscriptions,
  ]);

  return (
    <>
      <Box sx={{ ...homeBaseSX, ...homeColumns }}>
        <SearchSidebar />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {searchParameters && (
            <TabContext value={tabValue}>
              <TabList
                onChange={changeTab}
                textColor={'secondary'}
                indicatorColor={'secondary'}
                centered={false}
              >
                <Tab label="All" value={'all'} sx={tabSX} />
                <Tab label="Subscriptions" value={'subscriptions'} sx={tabSX} />
              </TabList>
              <TabPanel value={'all'} sx={tabPaneSX}>
                <VideoList
                  listName="AllVideos"
                  searchParameters={searchParameters}
                />
              </TabPanel>
              <TabPanel value={'subscriptions'} sx={tabPaneSX}>
                {subscriptions.length > 0 ? (
                  <>
                    <VideoList
                      listName="SubscribedVideos"
                      searchParameters={searchParameters}
                    />
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    You have no subscriptions
                  </div>
                )}
              </TabPanel>
            </TabContext>
          )}
        </Box>
        <ListSuperLikeContainer />
      </Box>
    </>
  );
};
