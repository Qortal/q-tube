import CSS from 'csstype';
import { useCallback, useRef } from 'react';

import { VideoPlayer as QappVideoPlayer, Service, useGlobal } from 'qapp-core';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { usePersistedState } from '../../../state/persist/persist';
import { JavascriptOutlined } from '@mui/icons-material';
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
  filename: string;
  parentStyles?: CSS.Properties;
}

export const VideoPlayer = ({ ...props }: VideoPlayerProps) => {
  const isSmall = useIsSmall();
  const videoRef = useRef(null);
  const location = useLocation();
  const { lists } = useGlobal();
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState('watched-v1', []);
  const onPlay = useCallback(() => {
    if (!isHydratedWatchedHistory) return;
    const videoReference = {
      identifier: props?.jsonId,
      name: props?.user,
      service: 'DOCUMENT',
      watchedAt: Date.now(),
    };

    setWatchedHistory((prev) => {
      const exists = prev.some(
        (v) =>
          v.identifier === videoReference.identifier &&
          v.name === videoReference.name &&
          v.service === videoReference.service
      );

      if (exists) return prev; // Already watched, don't add again
      lists.deleteList(`watched-history`);
      // Add to beginning, then keep only latest 200
      return [videoReference, ...prev].slice(0, 200);
    });
  }, [props?.jsonId, props?.user, isHydratedWatchedHistory]);
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
          name: props.name,
          service: props.service as Service,
          identifier: props.identifier,
        }}
        autoPlay={props?.autoPlay}
        onEnded={props?.onEnd}
        onPlay={onPlay}
        filename={props?.filename}
        path={location.pathname}
      />
    </Box>
  );
};
