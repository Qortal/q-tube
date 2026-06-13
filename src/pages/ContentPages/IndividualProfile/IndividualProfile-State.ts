import { usePersistedState } from '../../../state/persist/persist.ts';

export const useIndividualProfileState = (isOwnChannel: boolean) => {
  const [channelTab, setChannelTab, isHydrated] = usePersistedState(
    'channelTab',
    0 // default to videos
  );

  return {
    channelTab: isOwnChannel ? channelTab : 0,
    setChannelTab: isOwnChannel ? setChannelTab : () => {},
    isHydrated,
  };
};