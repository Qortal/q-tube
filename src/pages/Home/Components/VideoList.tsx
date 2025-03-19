import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlaylistSVG } from "../../../assets/svgs/PlaylistSVG.tsx";
import ResponsiveImage from "../../../components/ResponsiveImage.tsx";
import { fontSizeSmall, minDuration } from "../../../constants/Misc.ts";
import {
  blockUser,
  setEditPlaylist,
  setEditVideo,
  Video,
} from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
import { formatTime } from "../../../utils/numberFunctions.ts";
import { formatDate } from "../../../utils/time.ts";
import { VideoCardImageContainer } from "./VideoCardImageContainer.tsx";
import {
  BlockIconContainer,
  BottomParent,
  IconsBox,
  NameContainer,
  VideoCard,
  VideoCardCol,
  VideoCardContainer,
  VideoCardName,
  VideoCardTitle,
  VideoUploadDate,
} from "./VideoList-styles.tsx";
import { ResourceListDisplay, useGlobal } from "qapp-core";

interface VideoListProps {
  listName: string;
  searchParameters: any;
}
export const VideoList = ({ listName, searchParameters }: VideoListProps) => {
  const [showIcons, setShowIcons] = useState(null);

  const username = useSelector((state: RootState) => state.auth?.user?.name);

  const { resources } = useGlobal();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

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

  const listItem = useCallback(
    (item, index) => {
      const { qortalMetadata, data: video } = item;
      return (
        <VideoCardCol
          key={qortalMetadata?.identifier}
          onMouseEnter={() => setShowIcons(qortalMetadata?.identifier)}
          onMouseLeave={() => setShowIcons(null)}
        >
          <IconsBox
            sx={{
              opacity: showIcons === qortalMetadata.identifier ? 1 : 0,
              zIndex: 2,
            }}
          >
            {qortalMetadata?.name === username && (
              <Tooltip title="Edit video properties" placement="top">
                <BlockIconContainer>
                  <EditIcon
                    onClick={() => {
                      dispatch(setEditVideo(item));
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}

            {qortalMetadata?.name !== username && (
              <Tooltip title="Block user content" placement="top">
                <BlockIconContainer>
                  <BlockIcon
                    onClick={() => {
                      blockUserFunc(qortalMetadata?.name);
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}
            {qortalMetadata?.name === username && (
              <Tooltip title="Delete video" placement="top">
                <BlockIconContainer>
                  <DeleteIcon
                    onClick={() => {
                      resources.deleteProduct([
                        qortalMetadata,
                        video.videoReference,
                      ]);
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}
          </IconsBox>
          <VideoCard
            onClick={() => {
              navigate(
                `/video/${qortalMetadata?.name}/${qortalMetadata?.identifier}`
              );
            }}
          >
            {video?.duration > minDuration && (
              <Box
                position="absolute"
                right={0}
                bottom={0}
                bgcolor="#202020"
                zIndex={999}
              >
                <Typography color="white">
                  {formatTime(video.duration)}
                </Typography>
              </Box>
            )}
            <VideoCardImageContainer
              width={266}
              height={150}
              videoImage={video.videoImage}
              frameImages={video?.extracts || []}
            />
            <Tooltip
              title={video.title}
              placement="top"
              slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
            >
              <VideoCardTitle>{video.title}</VideoCardTitle>
            </Tooltip>
            <BottomParent>
              <NameContainer
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/channel/${qortalMetadata?.name}`);
                }}
              >
                <Avatar
                  sx={{ height: 24, width: 24 }}
                  src={`/arbitrary/THUMBNAIL/${qortalMetadata?.name}/qortal_avatar`}
                  alt={`${qortalMetadata?.name}'s avatar`}
                />
                <VideoCardName
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {qortalMetadata?.name}
                </VideoCardName>
              </NameContainer>
              {qortalMetadata?.created && (
                <Box sx={{ flexDirection: "row", width: "100%" }}>
                  <VideoUploadDate sx={{ display: "inline" }}>
                    {formatDate(qortalMetadata.created)}
                  </VideoUploadDate>
                </Box>
              )}
            </BottomParent>
          </VideoCard>
        </VideoCardCol>
      );
    },
    [username, showIcons]
  );

  const skeletonVideoCard = (
    <VideoCard>
      <Skeleton
        variant="rectangular"
        style={{
          width: 187,
          height: 130,
          borderRadius: "8px",
          marginTop: 10,
          alignSelf: "center",
        }}
      />

      <BottomParent>
        <NameContainer>
          <Skeleton
            variant="rectangular"
            style={{
              width: 200,
              height: 50,
              marginTop: 12,
              alignSelf: "center",
            }}
          />
        </NameContainer>
        <Skeleton
          variant="rectangular"
          style={{
            width: 200,
            height: 24,
            marginTop: 15,
            alignSelf: "center",
          }}
        />
        <Skeleton
          variant="rectangular"
          style={{
            width: 200,
            height: 24,
            marginTop: 15,
            alignSelf: "center",
          }}
        />
      </BottomParent>
    </VideoCard>
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
        loaderItem={status => {
          return (
            //<div>{status === "LOADING" ? skeletonVideoCard : "has error"}</div>
            skeletonVideoCard
          );
        }}
        listItem={listItem}
      />
    </VideoCardContainer>
  );
};

export default VideoList;
