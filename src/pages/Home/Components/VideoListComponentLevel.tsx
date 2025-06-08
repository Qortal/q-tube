import { Box } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { QTUBE_VIDEO_BASE } from "../../../constants/Identifiers.ts";

import { VideoManagerRow } from "./VideoList-styles.tsx";
import VideoList from "./VideoList.tsx";
import { QortalSearchParams } from "qapp-core";

interface VideoListProps {
  mode?: string;
}

export const VideoListComponentLevel = ({ mode }: VideoListProps) => {
  const { name: paramName } = useParams();

  const searchParameters: QortalSearchParams = useMemo(() => {
    return {
      identifier: QTUBE_VIDEO_BASE,
      service: "DOCUMENT",
      offset: 0,
      reverse: true,
      limit: 20,
      excludeBlocked: true,
      name: paramName || "",
      mode: "ALL",
      exactmatchnames: true,
    };
  }, [paramName]);

  return (
    <VideoManagerRow>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <VideoList
          listName="ChannelVideos"
          searchParameters={searchParameters}
        />
      </Box>
    </VideoManagerRow>
  );
};
