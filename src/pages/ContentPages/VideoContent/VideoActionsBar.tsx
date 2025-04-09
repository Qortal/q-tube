import DownloadIcon from "@mui/icons-material/Download";
import { Box, IconButton, SxProps, Theme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { LikeAndDislike } from "../../../components/common/ContentButtons/LikeAndDislike.tsx";
import { SuperLike } from "../../../components/common/ContentButtons/SuperLike.tsx";
import FileElement from "../../../components/common/FileElement.tsx";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import {
  smallScreenSizeString,
  titleFormatterOnSave,
} from "../../../constants/Misc.ts";
import { ChannelActions } from "./ChannelActions.tsx";
import {
  FileAttachmentContainer,
  FileAttachmentFont,
} from "./VideoContent-styles.tsx";
import { createQortalLink, IndexCategory, useGlobal } from "qapp-core";
import { useLocation } from "react-router-dom";




export interface VideoActionsBarProps {
  channelName: string;
  videoData: any;
  videoReference: any;
  superLikeList: any[];
  setSuperLikeList: React.Dispatch<React.SetStateAction<any[]>>;
  sx?: SxProps<Theme>;
}

function replaceAppNameInQortalUrl(url: string, newAppName: string): string {
  return url.replace(/(qortal:\/\/APP\/)[^/]+/, `$1${newAppName}`);
}


export const VideoActionsBar = ({
  channelName,
  videoData,
  videoReference,
  superLikeList,
  setSuperLikeList,
  sx,
}: VideoActionsBarProps) => {
  const location = useLocation();

  const openPageIndexManager = useGlobal().indexOperations.openPageIndexManager;
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
        marginTop: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        ...sx,
      }}
    >
      <ChannelActions channelName={channelName} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          alignItems: "center",
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
            <IconButton onClick={()=> {
              const link = createQortalLink( "APP", "Q-Tube", location.pathname)
              openPageIndexManager({
                link: link,
                name: channelName,
                category: IndexCategory.PUBLIC_PAGE_VIDEO,
                rootName: 'Q-Tube',
              });
            }}><TravelExploreIcon /></IconButton>
          </>
        )}
      </Box>

      {videoData && (
        <FileAttachmentContainer sx={{ width: "100%", maxWidth: "340px" }}>
          <FileAttachmentFont>Save Video</FileAttachmentFont>
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
      )}
    </Box>
  );
};
