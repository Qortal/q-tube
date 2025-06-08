import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { blockUser, setEditVideo } from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";

import { VideoCardContainer } from "./VideoList-styles.tsx";
import { QortalSearchParams, ResourceListDisplay } from "qapp-core";
import { VideoListItem } from "./VideoListItem.tsx";
import { VideoLoaderItem } from "./VideoLoaderItem.tsx";

interface VideoListProps {
  searchParameters: QortalSearchParams;
  listName: string;
}
export const VideoList = ({ searchParameters, listName }: VideoListProps) => {
  const [showIcons, setShowIcons] = useState(null);
  const username = useSelector((state: RootState) => state.auth?.user?.name);

  const dispatch = useDispatch();

  const blockUserFunc = async (user: string) => {
    if (user === "Q-Tube") return;

    try {
      const response = await qortalRequest({
        action: "ADD_LIST_ITEMS",
        list_name: "blockedNames",
        items: [user],
      });

      if (response === true) {
        dispatch(blockUser(user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderLoaderItem = useCallback(status => {
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
          setShowIcons={setShowIcons}
          showIcons={showIcons}
          username={username}
          setEditVideo={setEditVideo}
        />
      );
    },
    [username, showIcons]
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
