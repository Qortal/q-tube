import { Box } from '@mui/material';
import CSS from 'csstype';

import { Service, VideoPlayer as QappVideoPlayer } from 'qapp-core';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsSmall } from '../../../hooks/useIsSmall';

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
  filename: string | undefined;
  parentStyles?: CSS.Properties;
  created: number | undefined;
}

export const VideoPlayer = ({ ...props }: VideoPlayerProps) => {
  const isSmall = useIsSmall();
  const videoRef = useRef(null);
  const location = useLocation();

  // Cleanup video player on unmount
  useEffect(() => {
    return () => {
      // Cleanup video player resources
      if (videoRef.current) {
        const videoElement = videoRef.current as any;
        if (videoElement.pause) {
          videoElement.pause();
        }
        if (videoElement.src) {
          videoElement.src = '';
        }
        if (videoElement.load) {
          videoElement.load();
        }
      }
    };
  }, []);

  return (
    <Box
      sx={{
        // width: '100%',
        height: isSmall ? '240px' : '70vh',
        maxHeight: '70vh',
        background: 'black',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(props?.parentStyles || {}),
      }}
    >
      <QappVideoPlayer
        poster={props.poster}
        videoRef={videoRef}
        qortalVideoResource={{
          name: props.name!,
          service: props.service as Service,
          identifier: props.identifier!,
        }}
        autoPlay={props?.autoPlay}
        onEnded={props?.onEnd}
        filename={props?.filename}
        path={location.pathname}
        styling={{
          progressSlider: {
            thumbColor: 'white',
            railColor: '',
            trackColor: '#4285f4',
          },
        }}
      />
    </Box>
  );
};
