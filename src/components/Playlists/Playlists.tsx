import {
  Box,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { CardContentContainerComment } from '../common/Comments/Comments-styles';
import { useIsSmall } from '../../hooks/useIsSmall';

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
  const isSmall = useIsSmall();
  const theme = useTheme();
  const isScreenSmall = !useMediaQuery(`(min-width:700px)`);
  const PlaylistsHeight = '36vw'; // This is videoplayer width * 9/16 (inverse of aspect ratio)

  return (
    <Box
      sx={{
        // width: "100%",
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <CardContentContainerComment
        sx={{
          marginTop: '0px',
          height: '100%',
          gap: '3px',
          padding: '3px',
        }}
      >
        {playlistData?.videos?.map((vid, index) => {
          const isCurrentVidPlaying =
            vid?.identifier === currentVideoIdentifier;

          return (
            <Box
              key={vid?.identifier}
              sx={{
                display: 'flex',
                gap: '10px',
                width: '100%',

                alignItems: 'center',
                padding: '10px',
                borderRadius: '5px',
                cursor: isCurrentVidPlaying ? 'default' : 'pointer',
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.23)',
                ...(isCurrentVidPlaying && {
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }),
              }}
              onClick={() => {
                if (isCurrentVidPlaying) return;
                onClick(vid.name, vid.identifier);
                // navigate(`/video/${vid.name}/${vid.identifier}`)
              }}
            >
              <Typography
                sx={{
                  fontSize: isSmall ? '16px' : '18px',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Typography>
              <Typography
                sx={{
                  fontSize: isSmall ? '16px' : '18px',
                  wordBreak: 'break-word',
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
