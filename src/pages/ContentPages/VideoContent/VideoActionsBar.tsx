import { Avatar, Box, SxProps, Theme, useTheme } from "@mui/material";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";
import { LikeAndDislike } from "../../../components/common/ContentButtons/LikeAndDislike.tsx";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { SuperLike } from "../../../components/common/ContentButtons/SuperLike.tsx";
import FileElement from "../../../components/common/FileElement.tsx";
import { refType } from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
import { titleFormatterOnSave } from "../../../constants/Misc.ts";
import { useFetchSuperLikes } from "../../../hooks/useFetchSuperLikes.tsx";
import DownloadIcon from "@mui/icons-material/Download";
import { RootState } from "../../../state/store.ts";
import { ChannelActions } from "./ChannelActions.tsx";
import {
  AuthorTextComment,
  FileAttachmentContainer,
  FileAttachmentFont,
  StyledCardColComment,
  StyledCardHeaderComment,
} from "./VideoContent-styles.tsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

export interface VideoActionsBarProps {
  channelName: string;
  videoData: any;
  videoReference: any;
  superLikeList: any[];
  setSuperLikeList: React.Dispatch<React.SetStateAction<any[]>>;
  sx?: SxProps<Theme>;
}

export const VideoActionsBar = ({
  channelName,
  videoData,
  videoReference,
  superLikeList,
  setSuperLikeList,
  sx,
}: VideoActionsBarProps) => {
  const calculateAmountSuperlike = useMemo(() => {
    const totalQort = superLikeList?.reduce((acc, curr) => {
      if (curr?.amount && !isNaN(parseFloat(curr.amount)))
        return acc + parseFloat(curr.amount);
      else return acc;
    }, 0);
    return totalQort?.toFixed(2);
  }, [superLikeList]);

  const numberOfSuperlikes = useMemo(() => {
    return superLikeList?.length ?? 0;
  }, [superLikeList]);

  const saveAsFilename = useMemo(() => {
    // nb. we prefer to construct the local filename to use for
    // saving, from the video "title" when possible
    if (videoData?.title) {
      // figure out filename extension
      let ext = ".mp4";
      if (videoData?.filename) {
        // nb. this regex copied from https://stackoverflow.com/a/680982
        const re = /(?:\.([^.]+))?$/;
        const match = re.exec(videoData.filename);
        if (match[1]) {
          ext = "." + match[1];
        }
      }

      return (videoData.title + ext).replace(titleFormatterOnSave, "");
    }

    // otherwise use QDN filename if applicable
    if (videoData?.filename) {
      return videoData.filename.replace(titleFormatterOnSave, "");
    }

    // TODO: this was the previous value, leaving here as the
    // fallback for now even though it probably is not needed..?
    return videoData?.filename || videoData?.title?.slice(0, 20) + ".mp4";
  }, [videoData]);

  return (
    <Box
      sx={{
        width: "80%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginTop: "15px",
        ...sx,
      }}
    >
      <ChannelActions channelName={channelName} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {videoData && (
          <>
            <LikeAndDislike name={videoData?.user} identifier={videoData?.id} />
            <SuperLike
              numberOfSuperlikes={numberOfSuperlikes}
              totalAmount={calculateAmountSuperlike}
              name={videoData?.user}
              service={videoData?.service}
              identifier={videoData?.id}
              onSuccess={val => {
                setSuperLikeList(prev => [val, ...prev]);
              }}
            />

            <FileAttachmentContainer>
              <FileAttachmentFont>Save to Disk</FileAttachmentFont>
              <FileElement
                fileInfo={{
                  ...videoReference,
                  filename: saveAsFilename,
                  mimeType: videoData?.videoType || '"video/mp4',
                }}
                title={videoData?.filename || videoData?.title?.slice(0, 20)}
                customStyles={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <DownloadIcon />
              </FileElement>
            </FileAttachmentContainer>
          </>
        )}
      </Box>
    </Box>
  );
};
