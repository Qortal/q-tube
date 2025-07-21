import { RefObject, useCallback, useRef } from 'react';

import { VideoCardContainer } from './VideoList-styles.tsx';
import {
  LoaderListStatus,
  QortalSearchParams,
  ResourceListPreloadedDisplay,
  useAuth,
  useBlockedNames,
  useGlobal,
} from 'qapp-core';
import { VideoListItem } from './VideoListItem.tsx';
import { VideoLoaderItem } from './VideoLoaderItem.tsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { editVideoAtom } from '../../../state/publish/video.ts';
import { scrollRefAtom } from '../../../state/global/navbar.ts';
import { Box, Typography } from '@mui/material';

interface VideoListProps {
  listName: string;
  isBookmarks?: boolean;
  disableActions?: boolean;
  listId?: string;
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
  const { name: username } = useAuth();
  const setEditVideo = useSetAtom(editVideoAtom);
  const { addToBlockedList } = useBlockedNames();

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
          <Typography>No results</Typography>
        </Box>
      );
    }
    return <VideoLoaderItem status={status} />;
  }, []);

  const renderListItem = useCallback(
    (item, index) => {
      const { qortalMetadata, data: video } = item;

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
