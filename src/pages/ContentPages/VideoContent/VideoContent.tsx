import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { CommentSection } from '../../../components/common/Comments/CommentSection.tsx';
import { SuperLikesSection } from '../../../components/common/SuperLikesList/SuperLikesSection.tsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer/VideoPlayer.tsx';
import { motion } from 'framer-motion';

import {
  fontSizeSmall,
  minFileSize,
  smallVideoSize,
} from '../../../constants/Misc.ts';
import { formatBytes } from '../../../utils/numberFunctions.ts';
import { formatDate } from '../../../utils/time.ts';
import { VideoActionsBar } from './VideoActionsBar.tsx';
import { useVideoContentState } from './VideoContent-State.ts';
import DOMPurify from 'dompurify';

import {
  Spacer,
  VideoContentContainer,
  VideoPlayerContainer,
  VideoTitle,
} from './VideoContent-styles.tsx';
import { useScrollToTop } from '../../../hooks/useScrollToTop.tsx';
import { handleClickText, processText } from 'qapp-core';
import { PageTransition } from '../../../components/common/PageTransition.tsx';
import { useIsMobile } from '../../../hooks/useIsMobile.tsx';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { useTranslation } from 'react-i18next';

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
    <Box sx={{ maxWidth: '1200px' }}>
      {text && (
        <Typography
          ref={textRef}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
            WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
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
  const {
    videoReference,
    channelName,
    id,
    videoCover,
    isVideoLoaded,
    theme,
    videoData,
    descriptionHeight,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
    superLikeList,
    setSuperLikeList,
  } = useVideoContentState();
  const isSmall = useIsSmall();
  const { i18n } = useTranslation(['core']);

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
            />
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
            {videoData?.fileSize > minFileSize && (
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
              />
              <CommentSection postId={id || ''} postName={channelName || ''} />
            </>
          )}
        </VideoContentContainer>
      </Box>
    </PageTransition>
  );
};
