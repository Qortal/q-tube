import { Box } from '@mui/material';
import CSS from 'csstype';

import { Service, VideoPlayer as QappVideoPlayer, useGlobal } from 'qapp-core';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsSmall } from '../../../hooks/useIsSmall';
import { usePersistedState } from '../../../state/persist/persist.ts';

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
  onStart?: () => void;
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
  const { lists } = useGlobal();
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState<any[]>('watched-v1', []);

  const onPlay = useCallback(() => {
    // Notify parent that playback has started (fires on first click/play).
    // Called before the hydration guard so it always signals the start.
    props?.onStart?.();
    if (!isHydratedWatchedHistory) return;
    const videoReference = {
      identifier: props?.jsonId,
      name: props?.user,
      service: 'DOCUMENT',
      created: props?.created || Date.now(),
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
      onClick={onPlay}
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
        onPlay={onPlay}
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
