import { useCallback } from 'react';

import { VideoCardContainer } from './VideoList-styles.tsx';
import {
  QortalSearchParams,
  ResourceListDisplay,
  useAuth,
  useBlockedNames,
  useGlobal,
} from 'qapp-core';
import { VideoListItem } from './VideoListItem.tsx';
import { VideoLoaderItem } from './VideoLoaderItem.tsx';
import { useSetAtom } from 'jotai';
import { editVideoAtom } from '../../../state/publish/video.ts';

interface VideoListProps {
  searchParameters: QortalSearchParams;
  listName: string;
}
export const VideoList = ({ searchParameters, listName }: VideoListProps) => {
  const { name: username } = useAuth();
  const setEditVideo = useSetAtom(editVideoAtom);
  const { addToBlockedList } = useBlockedNames();

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
        />
      );
    },
    [username]
  );

  return (
    <VideoCardContainer>
      <ResourceListDisplay
        styles={{
          gap: 20,
          horizontalStyles: {
            minItemWidth: 200,
          },
        }}
        retryAttempts={3}
        listName={listName}
        direction="HORIZONTAL"
        disableVirtualization
        disablePagination
        search={searchParameters}
        loaderItem={renderLoaderItem}
        listItem={renderListItem}
        returnType="JSON"
      />
    </VideoCardContainer>
  );
};

export default VideoList;
