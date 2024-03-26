import React from "react";
import { CardContentContainerComment } from "../common/Comments/Comments-styles";
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from "../Publish/PublishVideo/PublishVideo-styles.tsx";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Playlists = ({
  playlistData,
  currentVideoIdentifier,
  onClick,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "25vw",
        maxHeight: "70vh",
      }}
    >
      <CardContentContainerComment
        sx={{
          marginTop: "0px",
          height: "100%",
          overflow: "auto",
        }}
      >
        {playlistData?.videos?.map((vid, index) => {
          const isCurrentVidPlayling =
            vid?.identifier === currentVideoIdentifier;

          return (
            <Box
              key={vid?.identifier}
              sx={{
                display: "flex",
                gap: "10px",
                width: "100%",
                background: isCurrentVidPlayling && theme.palette.primary.main,
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                cursor: isCurrentVidPlayling ? "default" : "pointer",
                userSelect: "none",
              }}
              onClick={() => {
                if (isCurrentVidPlayling) return;
                onClick(vid.name, vid.identifier);
                // navigate(`/video/${vid.name}/${vid.identifier}`)
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  wordBreak: "break-word",
                }}
              >
                {vid?.metadata?.title}
              </Typography>
            </Box>
          );
        })}
      </CardContentContainerComment>
    </Box>
  );
};
