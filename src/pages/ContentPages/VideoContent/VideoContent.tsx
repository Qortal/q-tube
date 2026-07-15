import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import DOMPurify from 'dompurify';
import { handleClickText, processText, useProgressStore } from 'qapp-core';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { CommentSection } from '../../../components/common/Comments/CommentSection.tsx';
import { PageTransition } from '../../../components/common/PageTransition.tsx';
import { SuperLikesSection } from '../../../components/common/SuperLikesList/SuperLikesSection.tsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer/VideoPlayer.tsx';

import {
  minDuration,
  minFileSize,
  smallVideoSize,
} from '../../../constants/Misc.ts';
import { useIsMobile } from '../../../hooks/useIsMobile.tsx';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { useScrollToTop } from '../../../hooks/useScrollToTop.tsx';
import { formatBytes, formatTime } from '../../../utils/numberFunctions.ts';
import { formatDate } from '../../../utils/time.ts';
import { VideoActionsBar } from './VideoActionsBar.tsx';
import { useVideoContentState } from './VideoContent-State.ts';

import {
  Spacer,
  VideoContentContainer,
  VideoPlayerContainer,
  VideoTitle,
} from './VideoContent-styles.tsx';

function flattenHtml(html: string): string {
  const sanitize: string = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  const res = processText(sanitize);
  return res;
}

export const CollapsibleDescription = ({
  text,
  html,
}: {
  text?: string;
  html?: any;
}) => {
  const { t } = useTranslation(['core']);

  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;

      // Clone the element to measure full height
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.visibility = 'hidden';
      clone.style.position = 'absolute';
      clone.style.pointerEvents = 'none';
      clone.style.webkitLineClamp = 'none';
      clone.style.display = 'block';

      document.body.appendChild(clone);
      const fullHeight = clone.offsetHeight;
      document.body.removeChild(clone);

      const clampedHeight = el.offsetHeight;

      if (fullHeight > clampedHeight + 2) {
        setShowMore(true);
      }
    }
  }, [text, html]);

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%' }}>
      {text && (
        <Typography
          ref={textRef}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {text}
        </Typography>
      )}
      {html && (
        <Box
          onClick={handleClickText}
          ref={textRef}
          sx={{
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
          dangerouslySetInnerHTML={{ __html: flattenHtml(html) }}
        />
      )}
      {showMore && (
        <Button
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {expanded
            ? t('core:video.show_less', {
                postProcess: 'capitalizeFirstChar',
              })
            : t('core:video.show_more', {
                postProcess: 'capitalizeFirstChar',
              })}
        </Button>
      )}
    </Box>
  );
};

export const VideoContent = () => {
  useScrollToTop();
  const { commentID } = useParams<{ commentID?: string }>();
  const {
    videoReference,
    channelName,
    id,
    videoCover,
    theme,
    videoData,
    loadingSuperLikes,
    superLikeList,
    setSuperLikeList,
  } = useVideoContentState();
  const isSmall = useIsSmall();
  const { i18n } = useTranslation(['core']);

  // Saved playback progress - shown as a blue bar at the bottom of the player
  // only in the initial state, before the video is clicked/started.
  // Key format matches what the qapp-core VideoPlayer stores:
  // `${service}-${name}-${identifier}` (VIDEO service reference).
  const { progressMap } = useProgressStore();
  // Track which video was started by key (not a boolean). This auto-resets
  // when the current video changes (different key), so the bar reappears for
  // each new video without an effect or remount.
  const [startedVideoKey, setStartedVideoKey] = useState<string | null>(null);

  const progressKey = videoReference
    ? `${videoReference.service}-${videoReference.name}-${videoReference.identifier}`
    : '';
  const hasStarted = !!progressKey && startedVideoKey === progressKey;
  const savedTime = progressKey ? (progressMap[progressKey] ?? 0) : 0;
  const videoDuration = videoData?.duration;
  // Match VideoListItem gating: duration present + saved time > 0.
  // No upper-bound check (Math.min clamps percent); avoids hiding bar on
  // fully-watched or rounding-edge videos.
  const hasProgress = !hasStarted && !!videoDuration && savedTime > 0;
  const progressPercent = hasProgress
    ? Math.min((savedTime / videoDuration) * 100, 100)
    : 0;

  const isScreenSmall = !useMediaQuery(smallVideoSize);
  const isMobile = useIsMobile();
  const [screenWidth, setScreenWidth] = useState<number>(
    window.innerWidth + 120
  );
  let videoWidth = 100;
  const maxWidth = 95;
  const pixelsPerPercent = 17.5;
  const smallScreenPixels = 700;

  if (!isScreenSmall)
    videoWidth =
      maxWidth - (screenWidth - smallScreenPixels) / pixelsPerPercent;

  const minWidthPercent = 70;
  if (videoWidth < minWidthPercent) videoWidth = minWidthPercent;

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setScreenWidth(window.innerWidth + 120);
    });
  }, []);

  return (
    <PageTransition>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '0px' : '10px',
          width: '100%',
        }}
      >
        {videoReference ? (
          <VideoPlayerContainer
            sx={{
              position: 'relative',
              height: isSmall ? '240px' : '70vh',
              maxHeight: '70vh',
              backgroundColor: 'black',
            }}
          >
            <VideoPlayer
              name={videoReference?.name}
              service={videoReference?.service}
              identifier={videoReference?.identifier}
              created={videoData?.created}
              user={channelName}
              jsonId={id}
              poster={videoCover || ''}
              videoStyles={{
                videoContainer: { aspectRatio: '16 / 9' },
                video: { aspectRatio: '16 / 9' },
              }}
              duration={videoData?.duration}
              filename={videoData?.filename}
              onStart={() => setStartedVideoKey(progressKey)}
            />
            {hasProgress && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: '#73859F80',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    backgroundColor: '#00ABFF',
                  }}
                />
              </Box>
            )}
            {!hasStarted && videoDuration && videoDuration > minDuration && (
              <Box
                position="absolute"
                right={5}
                bottom={5}
                zIndex={999}
                bgcolor="background.paper2"
                sx={{
                  padding: '5px',
                  borderRadius: '5px',
                }}
              >
                <Typography variant="body2">
                  {formatTime(videoDuration)}
                </Typography>
              </Box>
            )}
          </VideoPlayerContainer>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: isSmall ? '240px' : '70vh',
              maxHeight: '70vh',
              background: 'black',
            }}
          ></Box>
        )}
        {/* <Spacer height="20px" /> */}
        <VideoContentContainer sx={{ padding: isSmall ? '5px' : '0px' }}>
          <VideoTitle
            variant={'h4'}
            color="textPrimary"
            sx={{
              textAlign: 'start',
              marginTop: '20px',
              ...(isSmall && {
                fontSize: '18px',
              }),
            }}
          >
            {videoData?.title}
          </VideoTitle>
          <Spacer height="10px" />
          <Box
            sx={{
              display: 'flex',
              gap: '14px',
            }}
          >
            {videoData?.created && (
              <Typography
                sx={{
                  fontSize: '14px',
                  display: 'inline',
                }}
                color={theme.palette.text.tertiary}
              >
                {formatDate(videoData.created, i18n.language)}
              </Typography>
            )}
            <Divider orientation="vertical" flexItem />
            {videoData?.fileSize && videoData?.fileSize > minFileSize && (
              <Typography
                sx={{
                  fontSize: '14px',
                  display: 'inline',
                }}
                color={theme.palette.text.tertiary}
              >
                {formatBytes(videoData.fileSize, 2, 'Decimal')}
              </Typography>
            )}
          </Box>
          <VideoActionsBar
            channelName={channelName || ''}
            videoData={videoData}
            setSuperLikeList={setSuperLikeList}
            superLikeList={superLikeList}
            videoReference={videoReference}
            sx={{ width: 'calc(100% - 5px)' }}
          />

          <Spacer height="15px" />
          {videoData?.htmlDescription ? (
            <CollapsibleDescription html={videoData?.htmlDescription} />
          ) : (
            <CollapsibleDescription text={videoData?.fullDescription} />
          )}

          {id && channelName && (
            <>
              <SuperLikesSection
                /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                getMore={() => {}}
                loadingSuperLikes={loadingSuperLikes}
                superlikes={superLikeList}
                postId={id || ''}
                postName={channelName || ''}
                commentID={commentID}
              />
              <CommentSection
                postId={id || ''}
                postName={channelName || ''}
                commentID={commentID}
              />
            </>
          )}
        </VideoContentContainer>
      </Box>
    </PageTransition>
  );
};
