import { usePersistedState } from '../../state/persist/persist.ts';
import { VideoListType } from '../../types/video.ts';

export const useHomeState = (mode: string) => {
  const [videoListTab, setVideoListTab, isHydratedVideoListTab] =
    usePersistedState<VideoListType>('videoListTab', 'all');

  const changeTab = (e: React.SyntheticEvent, newValue: VideoListType) => {
    setVideoListTab(newValue);
  };

  return {
    tabValue: videoListTab,
    changeTab,
  };
};
