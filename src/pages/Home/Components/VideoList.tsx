import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Tooltip, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlaylistSVG } from "../../../assets/svgs/PlaylistSVG.tsx";
import ResponsiveImage from "../../../components/ResponsiveImage.tsx";
import {
  blockUser,
  setEditPlaylist,
  setEditVideo,
  Video,
} from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
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

interface VideoListProps {
  videos: Video[];
}
export const VideoList = ({ videos }: VideoListProps) => {
  const [showIcons, setShowIcons] = useState(null);

  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const username = useSelector((state: RootState) => state.auth?.user?.name);

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

  return (
    <VideoCardContainer>
      {videos.map((video: any) => {
        const fullId = video ? `${video.id}-${video.user}` : undefined;
        const existingVideo = hashMapVideos[fullId];
        let hasHash = false;
        let videoObj = video;
        if (existingVideo) {
          videoObj = existingVideo;
          hasHash = true;
        }

        // nb. this prevents showing metadata for a video which
        // belongs to a different user
        if (
          videoObj?.user &&
          videoObj?.videoReference?.name &&
          videoObj.user != videoObj.videoReference.name
        ) {
          return null;
        }

        if (hasHash && !videoObj?.videoImage && !videoObj?.image) {
          return null;
        }
        const isPlaylist = videoObj?.service === "PLAYLIST";

        if (isPlaylist) {
          return (
            <VideoCardCol
              onMouseEnter={() => setShowIcons(videoObj.id)}
              onMouseLeave={() => setShowIcons(null)}
              key={videoObj.id}
            >
              <IconsBox
                sx={{
                  opacity: showIcons === videoObj.id ? 1 : 0,
                  zIndex: 2,
                }}
              >
                {videoObj?.user === username && (
                  <Tooltip title="Edit playlist" placement="top">
                    <BlockIconContainer>
                      <EditIcon
                        onClick={() => {
                          dispatch(setEditPlaylist(videoObj));
                        }}
                      />
                    </BlockIconContainer>
                  </Tooltip>
                )}

                {videoObj?.user !== username && (
                  <Tooltip title="Block user content" placement="top">
                    <BlockIconContainer>
                      <BlockIcon
                        onClick={() => {
                          blockUserFunc(videoObj?.user);
                        }}
                      />
                    </BlockIconContainer>
                  </Tooltip>
                )}
              </IconsBox>
              <VideoCard
                sx={{
                  cursor: !hasHash && "default",
                }}
                onClick={() => {
                  if (!hasHash) return;
                  navigate(`/playlist/${videoObj?.user}/${videoObj?.id}`);
                }}
              >
                <ResponsiveImage
                  src={videoObj?.image}
                  width={266}
                  height={150}
                  style={{
                    maxHeight: "50%",
                  }}
                />
                <VideoCardTitle>{videoObj?.title}</VideoCardTitle>
                <BottomParent>
                  <NameContainer
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/channel/${videoObj?.user}`);
                    }}
                  >
                    <Avatar
                      sx={{ height: 24, width: 24 }}
                      src={`/arbitrary/THUMBNAIL/${videoObj?.user}/qortal_avatar`}
                      alt={`${videoObj?.user}'s avatar`}
                    />
                    <VideoCardName
                      sx={{
                        ":hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {videoObj?.user}
                    </VideoCardName>

                    {videoObj?.created && (
                      <VideoUploadDate>
                        {formatDate(videoObj.created)}
                      </VideoUploadDate>
                    )}
                  </NameContainer>
                  <Box
                    sx={{
                      display: "flex",
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                    }}
                  >
                    <PlaylistSVG
                      color={theme.palette.text.primary}
                      height="36px"
                      width="36px"
                    />
                  </Box>
                </BottomParent>
              </VideoCard>
            </VideoCardCol>
          );
        }

        return (
          <VideoCardCol
            key={videoObj.id}
            onMouseEnter={() => setShowIcons(videoObj.id)}
            onMouseLeave={() => setShowIcons(null)}
          >
            <IconsBox
              sx={{
                opacity: showIcons === videoObj.id ? 1 : 0,
                zIndex: 2,
              }}
            >
              {videoObj?.user === username && (
                <Tooltip title="Edit video properties" placement="top">
                  <BlockIconContainer>
                    <EditIcon
                      onClick={() => {
                        dispatch(setEditVideo(videoObj));
                      }}
                    />
                  </BlockIconContainer>
                </Tooltip>
              )}

              {videoObj?.user !== username && (
                <Tooltip title="Block user content" placement="top">
                  <BlockIconContainer>
                    <BlockIcon
                      onClick={() => {
                        blockUserFunc(videoObj?.user);
                      }}
                    />
                  </BlockIconContainer>
                </Tooltip>
              )}
            </IconsBox>
            <VideoCard
              onClick={() => {
                navigate(`/video/${videoObj?.user}/${videoObj?.id}`);
              }}
            >
              <VideoCardImageContainer
                width={266}
                height={150}
                videoImage={videoObj.videoImage}
                frameImages={videoObj?.extracts || []}
              />
              <VideoCardTitle>{videoObj.title}</VideoCardTitle>
              <BottomParent>
                <NameContainer
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/channel/${videoObj?.user}`);
                  }}
                >
                  <Avatar
                    sx={{ height: 24, width: 24 }}
                    src={`/arbitrary/THUMBNAIL/${videoObj?.user}/qortal_avatar`}
                    alt={`${videoObj?.user}'s avatar`}
                  />
                  <VideoCardName
                    sx={{
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {videoObj?.user}
                  </VideoCardName>
                </NameContainer>
                {videoObj?.created && (
                  <Box sx={{ flexDirection: "row", width: "100%" }}>
                    <VideoUploadDate sx={{ display: "inline" }}>
                      {formatDate(videoObj.created)}
                    </VideoUploadDate>
                  </Box>
                )}
              </BottomParent>
            </VideoCard>
          </VideoCardCol>
        );
      })}
    </VideoCardContainer>
  );
};

export default VideoList;
