import { Avatar, Box, Typography, useTheme } from "@mui/material";
import React from "react";

import DeletedVideo from "../../../assets/img/DeletedVideo.jpg";
import { CommentSection } from "../../../components/common/Comments/CommentSection.tsx";
import { SuperLikesSection } from "../../../components/common/SuperLikesList/SuperLikesSection.tsx";
import { DisplayHtml } from "../../../components/common/TextEditor/DisplayHtml.tsx";
import {
  videoRefType,
  VideoPlayer,
} from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
import {
  QTUBE_VIDEO_BASE,
  SUPER_LIKE_BASE,
} from "../../../constants/Identifiers.ts";
import {
  fontSizeMedium,
  minPriceSuperlike,
  titleFormatterOnSave,
} from "../../../constants/Misc.ts";
import { useFetchSuperLikes } from "../../../hooks/useFetchSuperLikes.tsx";
import { setIsLoadingGlobal } from "../../../state/features/globalSlice.ts";
import { addToHashMap } from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
import { formatBytes } from "../../../utils/numberFunctions.ts";
import { formatDate } from "../../../utils/time.ts";
import { VideoActionsBar } from "./VideoActionsBar.tsx";
import {
  extractSigValue,
  getPaymentInfo,
  isTimestampWithinRange,
  useVideoContentState,
} from "./VideoContent-State.ts";
import {
  AuthorTextComment,
  FileAttachmentContainer,
  FileAttachmentFont,
  Spacer,
  StyledCardColComment,
  StyledCardHeaderComment,
  VideoDescription,
  VideoContentContainer,
  VideoTitle,
  VideoPlayerContainer,
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
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 10px 0px 5%",
        }}
        onClick={focusVideo}
      >
        {videoReference ? (
          <VideoPlayerContainer>
            <VideoPlayer
              name={videoReference?.name}
              service={videoReference?.service}
              identifier={videoReference?.identifier}
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
        ) : isVideoLoaded ? (
          <img
            src={DeletedVideo}
            width={"70%"}
            height={"37%"}
            style={{ marginLeft: "5%" }}
          />
        ) : (
          <Box sx={{ width: "55vw", aspectRatio: "16/9" }}></Box>
        )}
        <VideoContentContainer>
          <VideoActionsBar
            channelName={channelName}
            videoData={videoData}
            setSuperLikeList={setSuperLikeList}
            superLikeList={superLikeList}
            videoReference={videoReference}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            <VideoTitle
              variant="h1"
              color="textPrimary"
              sx={{
                textAlign: "start",
              }}
            >
              {videoData?.title}
            </VideoTitle>
          </Box>
          {videoData?.fileSize && (
            <Typography
              variant="h1"
              sx={{
                fontSize: "90%",
              }}
              color={"green"}
            >
              {formatBytes(videoData.fileSize, 2, "Decimal")}
            </Typography>
          )}
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
                width: "70%",
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
