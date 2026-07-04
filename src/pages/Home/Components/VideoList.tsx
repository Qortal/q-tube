import { Box, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  LoaderListStatus,
  QortalSearchParams,
  ResourceListDisplay,
  useAuth,
  useBlockedNames,
  useCacheStore,
} from 'qapp-core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../../hooks/useIsMobile.tsx';
import { scrollRefAtom } from '../../../state/global/navbar.ts';
import { editVideoAtom } from '../../../state/publish/video.ts';
import {
  isValidPlaylistMetadata,
  isValidVideoMetadata,
} from '../../../utils/checkStructure.ts';

import { VideoCardContainer } from './VideoList-styles.tsx';
import { VideoListItem } from './VideoListItem.tsx';
import { VideoLoaderItem } from './VideoLoaderItem.tsx';

interface VideoListProps {
  searchParameters: QortalSearchParams;
  listName: string;
}
const VideoList = ({ searchParameters, listName }: VideoListProps) => {
  const { t } = useTranslation(['core']);

  const { name: username } = useAuth();
  const setEditVideo = useSetAtom(editVideoAtom);
  const { addToBlockedList } = useBlockedNames();
  const markResourceAsDeleted = useCacheStore((s) => s.markResourceAsDeleted);
  const isMobile = useIsMobile();
  const scrollRef = useAtomValue(scrollRefAtom);

  const blockUserFunc = async (user: string) => {
    if (user === 'Q-Tube') return;

    try {
      await addToBlockedList([user]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLoaderItem = useCallback((status) => {
    return <VideoLoaderItem status={status} />;
  }, []);

  const renderLoaderList = useCallback(
    (status: LoaderListStatus) => {
      if (status === 'NO_RESULTS') {
        return (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Typography>
              {' '}
              {t('core:lists.no_results', {
                postProcess: 'capitalizeFirstChar',
              })}
            </Typography>
          </Box>
        );
      }
      return <VideoLoaderItem status={status} />;
    },
    [t]
  );

  const renderListItem = useCallback(
    (item, index) => {
      const { qortalMetadata, data: video } = item;

      const isPlaylist = qortalMetadata?.service === 'PLAYLIST';
      const isValid = isPlaylist
        ? isValidPlaylistMetadata(video)
        : isValidVideoMetadata(video);
      const isOwn = qortalMetadata?.name === username;

      // Drop spam/empty publishes. Marking the resource deleted via
      // qapp-core's cache store removes it from this list (and all
      // other lists) entirely so the slot collapses and the next item
      // takes its place — returning null would leave an empty slot
      // because ListItemWrapper still renders a Fragment wrapper.
      // Only keep invalid publishes when the current user owns them,
      // so they can edit/delete to fix.
      if (!isValid && !isOwn) {
        markResourceAsDeleted(qortalMetadata);
        return null;
      }

      return (
        <VideoListItem
          key={`${qortalMetadata?.name}-${qortalMetadata?.identifier}-${qortalMetadata?.service}`}
          qortalMetadata={qortalMetadata}
          video={video}
          blockUserFunc={blockUserFunc}
          username={username}
          setEditVideo={setEditVideo}
          isInvalid={!isValid}
        />
      );
    },
    [username, markResourceAsDeleted]
  );

  return (
    <VideoCardContainer>
      <ResourceListDisplay
        styles={{
          gap: 40,
          horizontalStyles: {
            minItemWidth: isMobile ? 200 : 320,
          },
        }}
        retryAttempts={3}
        listName={listName}
        direction="HORIZONTAL"
        disableVirtualization
        disablePagination
        search={searchParameters}
        loaderItem={renderLoaderItem}
        loaderList={renderLoaderList}
        listItem={renderListItem}
        returnType="JSON"
        scrollerRef={scrollRef}
      />
    </VideoCardContainer>
  );
};

export default VideoList;
