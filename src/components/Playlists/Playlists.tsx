import {
  Box,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { CardContentContainerComment } from "../common/Comments/Comments-styles";

interface PlaylistsProps {
  playlistData;
  currentVideoIdentifier;
  onClick;
  sx?: SxProps<Theme>;
}
export const Playlists = ({
  playlistData,
  currentVideoIdentifier,
  onClick,
  sx,
}: PlaylistsProps) => {
  const theme = useTheme();
  const isScreenSmall = !useMediaQuery(`(min-width:700px)`);
  const PlaylistsHeight = "36vw"; // This is videoplayer width * 9/16 (inverse of aspect ratio)

  return (
    <Box
      sx={{
        width: "100%",
        height: isScreenSmall ? "200px" : PlaylistsHeight,
        ...sx,
        display: "flex",
        flexDirection: "column",
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
          const isCurrentVidPlaying =
            vid?.identifier === currentVideoIdentifier;

          return (
            <Box
              key={vid?.identifier}
              sx={{
                display: "flex",
                gap: "10px",
                width: "100%",
                background: isCurrentVidPlaying && theme.palette.primary.main,
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                cursor: isCurrentVidPlaying ? "default" : "pointer",
                userSelect: "none",
              }}
              onClick={() => {
                if (isCurrentVidPlaying) return;
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
