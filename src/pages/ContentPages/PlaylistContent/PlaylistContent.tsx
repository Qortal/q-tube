import { Box, Typography } from "@mui/material";
import React from "react";
import { CommentSection } from "../../../components/common/Comments/CommentSection.tsx";
import { SuperLikesSection } from "../../../components/common/SuperLikesList/SuperLikesSection.tsx";
import { DisplayHtml } from "../../../components/common/TextEditor/DisplayHtml.tsx";
import { VideoPlayer } from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
import { Playlists } from "../../../components/Playlists/Playlists.tsx";
import { formatDate } from "../../../utils/time.ts";
import { VideoActionsBar } from "../VideoContent/VideoActionsBar.tsx";
import { usePlaylistContentState } from "./PlaylistContent-State.ts";
import {
  Spacer,
  VideoDescription,
  VideoPlayerContainer,
  VideoTitle,
} from "./PlaylistContent-styles.tsx";

export const PlaylistContent = () => {
  const {
    channelName,
    id,
    videoData,
    superLikeList,
    getVideoData,
    videoReference,
    focusVideo,
    videoCover,
    containerRef,
    theme,
    descriptionHeight,
    nextVideo,
    onEndVideo,
    doAutoPlay,
    playlistData,
    setSuperLikeList,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
  } = usePlaylistContentState();

  return videoData && videoData?.videos?.length === 0 ? (
    <Box
      sx={{
        width: "100%",
        display: "flex",
      }}
    >
      <Typography>This playlist doesn't exist</Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "0px 10px",
        marginLeft: "5%",
      }}
      onClick={focusVideo}
    >
      <VideoPlayerContainer
        sx={{
          marginBottom: "30px",
        }}
      >
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "55vw 35vw",
              width: "100vw",
              gap: "3vw",
            }}
          >
            {videoReference && (
              <Box
                sx={{
                  aspectRatio: "16/9",
                }}
              >
                <VideoPlayer
                  name={videoReference?.name}
                  service={videoReference?.service}
                  identifier={videoReference?.identifier}
                  user={channelName}
                  jsonId={id}
                  poster={videoCover || ""}
                  nextVideo={nextVideo}
                  onEnd={onEndVideo}
                  autoPlay={doAutoPlay}
                  ref={containerRef}
                  videoStyles={{
                    videoContainer: { aspectRatio: "16 / 9" },
                    video: { aspectRatio: "16 / 9" },
                  }}
                />
              </Box>
            )}
            {playlistData && (
              <Playlists
                playlistData={playlistData}
                currentVideoIdentifier={videoData?.id}
                onClick={getVideoData}
              />
            )}
          </Box>

          <VideoActionsBar
            channelName={channelName}
            videoData={videoData}
            videoReference={videoReference}
            superLikeList={superLikeList}
            setSuperLikeList={setSuperLikeList}
            sx={{ width: "100%" }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "10px",
              gap: "10px",
            }}
          >
            <VideoTitle
              variant="h1"
              color="textPrimary"
              sx={{
                textAlign: "center",
              }}
            >
              {videoData?.title}
            </VideoTitle>
          </Box>

          {videoData?.created && (
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
              }}
              color={theme.palette.text.primary}
            >
              {formatDate(videoData.created)}
            </Typography>
          )}

          <Spacer height="30px" />
          {videoData?.fullDescription && (
            <Box
              sx={{
                background: "#333333",
                borderRadius: "5px",
                padding: "5px",
                width: "100%",
                cursor: !descriptionHeight
                  ? "default"
                  : isExpandedDescription
                  ? "default"
                  : "pointer",
                position: "relative",
              }}
              className={
                !descriptionHeight
                  ? ""
                  : isExpandedDescription
                  ? ""
                  : "hover-click"
              }
            >
              {descriptionHeight && !isExpandedDescription && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    left: "0px",
                    bottom: "0px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (isExpandedDescription) return;
                    setIsExpandedDescription(true);
                  }}
                />
              )}
              <Box
                ref={contentRef}
                sx={{
                  height: !descriptionHeight
                    ? "auto"
                    : isExpandedDescription
                    ? "auto"
                    : `${descriptionHeight}px`,
                  overflow: "hidden",
                }}
              >
                {videoData?.htmlDescription ? (
                  <DisplayHtml html={videoData?.htmlDescription} />
                ) : (
                  <VideoDescription
                    variant="body1"
                    color="textPrimary"
                    sx={{
                      cursor: "default",
                    }}
                  >
                    {videoData?.fullDescription}
                  </VideoDescription>
                )}
              </Box>
              {descriptionHeight >= descriptionThreshold && (
                <Typography
                  onClick={() => {
                    setIsExpandedDescription(prev => !prev);
                  }}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    paddingLeft: "15px",
                    paddingTop: "15px",
                  }}
                >
                  {isExpandedDescription ? "Show less" : "...more"}
                </Typography>
              )}
            </Box>
          )}
        </>
        {videoData?.id && videoData?.user && (
          <SuperLikesSection
            loadingSuperLikes={loadingSuperLikes}
            superlikes={superLikeList}
            postId={videoData?.id || ""}
            postName={videoData?.user || ""}
          />
        )}
        {videoData?.id && channelName && (
          <CommentSection
            postId={videoData?.id || ""}
            postName={channelName || ""}
          />
        )}
      </VideoPlayerContainer>
    </Box>
  );
};
