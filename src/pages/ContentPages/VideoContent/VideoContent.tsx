import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";

import DeletedVideo from "../../../assets/img/DeletedVideo.jpg";
import { CommentSection } from "../../../components/common/Comments/CommentSection.tsx";
import { SuperLikesSection } from "../../../components/common/SuperLikesList/SuperLikesSection.tsx";
import { DisplayHtml } from "../../../components/common/TextEditor/DisplayHtml.tsx";
import { VideoPlayer } from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
import {
  fontSizeSmall,
  minFileSize,
  smallVideoSize,
} from "../../../constants/Misc.ts";
import { formatBytes } from "../../../utils/numberFunctions.ts";
import { formatDate } from "../../../utils/time.ts";
import { VideoActionsBar } from "./VideoActionsBar.tsx";
import { useVideoContentState } from "./VideoContent-State.ts";
import {
  Spacer,
  VideoContentContainer,
  VideoDescription,
  VideoPlayerContainer,
  VideoTitle,
} from "./VideoContent-styles.tsx";

export const VideoContent = () => {
  const {
    focusVideo,
    videoReference,
    channelName,
    id,
    videoCover,
    containerRef,
    isVideoLoaded,
    theme,
    videoData,
    descriptionHeight,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
    superLikeList,
    setSuperLikeList,
  } = useVideoContentState();

  const isScreenSmall = !useMediaQuery(smallVideoSize);
  const [screenWidth, setScreenWidth] = useState<number>(
    window.innerWidth + 120
  );
  let videoWidth = 100;
  const maxWidth = 95;
  const pixelsPerPercent = 17.5;
  const smallScreenPixels = 700;

  if (!isScreenSmall)
    videoWidth =
      maxWidth - (screenWidth - smallScreenPixels) / pixelsPerPercent;

  const minWidthPercent = 70;
  if (videoWidth < minWidthPercent) videoWidth = minWidthPercent;

  useEffect(() => {
    window.addEventListener("resize", e => {
      setScreenWidth(window.innerWidth + 120);
    });
  }, []);

  const [newVideo, setNewVideo] = useState(null)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // padding: `0px 0px 0px ${isScreenSmall ? "0px" : "2%"}`,
          padding: '10px',
          width: "100%",
        }}
        onClick={focusVideo}
      >
        <Button onClick={()=> {
          setNewVideo({
            identifier: 'MYTEST2_vid_hymn-for-peace_gEpkBT',
            name: 'SafetyMongoose',
            service: 'VIDEO'
          })
        }}>play another</Button>
        <Button onClick={()=> setNewVideo(null)}>go back</Button>
        {videoReference ? (
          <VideoPlayerContainer
            sx={{
              // width: `${videoWidth}%`,
              // marginLeft: "0%",
              height: '70vh',
              backgroundColor: 'black'
            }}
          >
            <VideoPlayer
              name={newVideo?.name || videoReference?.name}
              service={newVideo?.service || videoReference?.service}
              identifier={newVideo?.identifier || videoReference?.identifier}
              user={channelName}
              jsonId={id}
              poster={videoCover || ""}
              ref={containerRef}
              videoStyles={{
                videoContainer: { aspectRatio: "16 / 9" },
                video: { aspectRatio: "16 / 9" },
              }}
              duration={videoData?.duration}
              
            />
          </VideoPlayerContainer>
        ) : (
          <Box sx={{ width: "100%", height: '70vh', background: 'black'}}></Box>
        )}
        <VideoContentContainer
          sx={{ paddingLeft: isScreenSmall ? "5px" : "0px" }}
        >
          <VideoTitle
            variant={isScreenSmall ? "h2" : "h1"}
            color="textPrimary"
            sx={{
              textAlign: "start",
              marginTop: isScreenSmall ? "20px" : "10px",
            }}
          >
            {videoData?.title}
          </VideoTitle>
          <Box>
            {videoData?.created && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: fontSizeSmall,
                  display: "inline",
                }}
                color={theme.palette.text.primary}
              >
                {formatDate(videoData.created)}
              </Typography>
            )}

            {videoData?.fileSize > minFileSize && (
              <Typography
                variant="h1"
                sx={{
                  fontSize: "90%",
                  display: "inline",
                  marginLeft: "20px",
                }}
                color={"green"}
              >
                {formatBytes(videoData.fileSize, 2, "Decimal")}
              </Typography>
            )}
          </Box>
          <VideoActionsBar
            channelName={channelName}
            videoData={videoData}
            setSuperLikeList={setSuperLikeList}
            superLikeList={superLikeList}
            videoReference={videoReference}
            sx={{ width: "calc(100% - 5px)" }}
          />

          <Spacer height="15px" />
          {videoData?.fullDescription && (
            <Box
              sx={{
                background: "#333333",
                borderRadius: "5px",
                padding: "5px",
                width: "95%",
                cursor: !descriptionHeight
                  ? "default"
                  : isExpandedDescription
                    ? "default"
                    : "pointer",
                position: "relative",
                marginBottom: "30px",
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
                      : "200px",
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

          {id && channelName && (
            <>
              <SuperLikesSection
                /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                getMore={() => {}}
                loadingSuperLikes={loadingSuperLikes}
                superlikes={superLikeList}
                postId={id || ""}
                postName={channelName || ""}
              />
              <CommentSection postId={id || ""} postName={channelName || ""} />
            </>
          )}
        </VideoContentContainer>
      </Box>
    </>
  );
};
