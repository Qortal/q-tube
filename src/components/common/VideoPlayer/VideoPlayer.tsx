import CSS from 'csstype';
import { useRef } from 'react';

import { VideoPlayer as QappVideoPlayer, Service } from 'qapp-core';
import { Box } from '@mui/material';
export interface VideoStyles {
  videoContainer?: CSS.Properties;
  video?: CSS.Properties;
  controls?: CSS.Properties;
}
export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  name?: string;
  identifier?: string;
  service?: Service;
  autoplay?: boolean;
  from?: string | null;
  videoStyles?: VideoStyles;
  user?: string;
  jsonId?: string;
  nextVideo?: any;
  onEnd?: () => void;
  autoPlay?: boolean;
  style?: CSS.Properties;
  duration?: number;
}

export const VideoPlayer = ({ ...props }: VideoPlayerProps) => {
  const videoRef = useRef(null);

  return (
    <Box
      sx={{
        width: '100%',
        height: '70vh',
        background: 'black',
      }}
    >
      <QappVideoPlayer
        poster={props.poster}
        videoRef={videoRef}
        qortalVideoResource={{
          name: props.name,
          service: props.service as Service,
          identifier: props.identifier,
        }}
      />
    </Box>
  );
};
