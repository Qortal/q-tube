import { Box, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  LoaderListStatus,
  QortalMetadata,
  ResourceListPreloadedDisplay,
  useAuth,
  useBlockedNames,
  useCacheStore,
} from 'qapp-core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  listName: string;
  isBookmarks?: boolean;
  disableActions?: boolean;
  listId?: string;
  videoList: QortalMetadata[];
  handleRemoveVideoFromList?: (
    listId: string,
    video: {
      name: string;
      identifier: string;
      service: string;
    }
  ) => void;
}
export const VideoListPreloaded = ({
  videoList,
  listName,
  isBookmarks,
  disableActions,
  listId,
  handleRemoveVideoFromList,
}: VideoListProps) => {
  const { t } = useTranslation(['core']);

  const { name: username } = useAuth();
  const setEditVideo = useSetAtom(editVideoAtom);
  const { addToBlockedList } = useBlockedNames();
  const markResourceAsDeleted = useCacheStore((s) => s.markResourceAsDeleted);

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

  const renderLoaderList = useCallback((status: LoaderListStatus) => {
    if (status === 'NO_RESULTS') {
      return (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
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
  }, []);

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
          isBookmarks
          disableActions={disableActions}
          isInvalid={!isValid}
          handleRemoveVideoFromList={() => {
            if (!listId || !handleRemoveVideoFromList) return;
            handleRemoveVideoFromList(listId, qortalMetadata);
          }}
        />
      );
    },
    [
      username,
      isBookmarks,
      handleRemoveVideoFromList,
      videoList,
      disableActions,
      listId,
      markResourceAsDeleted,
    ]
  );

  return (
    <VideoCardContainer>
      <ResourceListPreloadedDisplay
        styles={{
          gap: 40,
          horizontalStyles: {
            minItemWidth: 320,
          },
        }}
        retryAttempts={3}
        listName={listName}
        direction="HORIZONTAL"
        disableVirtualization
        disablePagination
        limit={20}
        loaderItem={renderLoaderItem}
        loaderList={renderLoaderList}
        listItem={renderListItem}
        returnType="JSON"
        scrollerRef={scrollRef}
        listOfResources={videoList}
      />
    </VideoCardContainer>
  );
};
