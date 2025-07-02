import { useAuth } from 'qapp-core';
import { usePersistedState } from '../../state/persist/persist.ts';
import { VideoListType } from '../../types/video.ts';
import { useSearchParams } from 'react-router-dom';

export const useHomeState = () => {
  const { isLoadingUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query'); // "example"
  // const page = searchParams.get('page'); // "2"
  console.log('query', query);
  const [videoListTab, setVideoListTab, isHydratedVideoListTab] =
    usePersistedState<VideoListType>('videoListTab', 'all');
  const [filterName, setFilterName, isHydratedFilterName] = usePersistedState(
    'filterName',
    ''
  );
  const [filterMode, setFilterMode, isHydratedFilterMode] = usePersistedState(
    'filterMode',
    'recent'
  );
  const [subscriptions, setSubscriptions, isHydratedSubscriptions] =
    usePersistedState('subscriptions', []);
  const [filterType, setFilterType, isHydratedFilterState] = usePersistedState(
    'filterType',
    'videos'
  );
  const [filterSearch, setFilterSearch, isHydratedFilterSearch] =
    usePersistedState('filterSearch', '');
  console.log('filterSearch', filterSearch);
  const [filterCategory, setFilterCategory, isHydratedFilterCategory] =
    usePersistedState<any>('filterCategory', '');
  const [filterSubCategory, setFilterSubCategory, isHydratedFilterSubCategory] =
    usePersistedState<any>('filterSubCategory', '');
  const isHydrated =
    isHydratedFilterState &&
    isHydratedFilterSearch &&
    isHydratedFilterName &&
    isHydratedFilterSubCategory &&
    isHydratedFilterCategory &&
    isHydratedFilterMode &&
    !isLoadingUser;

  const changeTab = (e: React.SyntheticEvent, newValue: VideoListType) => {
    setVideoListTab(newValue);
  };

  return {
    tabValue: videoListTab,
    changeTab,
    filterName,
    filterCategory,
    subscriptions,
    filterType,
    setFilterType,
    filterSearch,
    filterMode,
    filterSubCategory,
    isHydrated,
    setFilterMode,
    setFilterCategory,
  };
};
