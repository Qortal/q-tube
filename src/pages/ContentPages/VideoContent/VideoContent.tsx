import { Box, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import { CommentSection } from '../../../components/common/Comments/CommentSection.tsx';
import { SuperLikesSection } from '../../../components/common/SuperLikesList/SuperLikesSection.tsx';
import { DisplayHtml } from '../../../components/common/TextEditor/DisplayHtml.tsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer/VideoPlayer.tsx';
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
  VideoDescription,
  VideoPlayerContainer,
  VideoTitle,
} from './VideoContent-styles.tsx';
import { useScrollToTop } from '../../../hooks/useScrollToTop.tsx';
import { CrowdfundInlineContent } from '../../../components/Publish/EditPlaylist/Upload-styles.tsx';
import { convertQortalLinks } from '../../../components/common/TextEditor/utils.ts';

function flattenHtml(html: string): string {
  const sanitize: string = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  const res = convertQortalLinks(sanitize);
  return res
    .replace(/<\/p>/gi, ' ') // replace end of paragraph with space
    .replace(/<p[^>]*>/gi, '') // remove opening <p> tags
    .replace(/<\/?div[^>]*>/gi, '') // remove divs
    .replace(/\n/g, ' ') // remove newlines
    .trim();
}

const CollapsibleDescription = ({
  text,
  html,
}: {
  text?: string;
  html: any;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        maxWidth: '1200px',
      }}
    >
      {text && (
        <Typography
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
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
          }}
          dangerouslySetInnerHTML={{ __html: flattenHtml(html) }}
        />
      )}
      <Button
        onClick={() => setExpanded(!expanded)}
        size="small"
        sx={{ mt: 1, textTransform: 'none' }}
      >
        {expanded ? 'Show less' : 'Show more'}
      </Button>
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

  const isScreenSmall = !useMediaQuery(smallVideoSize);
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
  console.log('videoData', videoData);
  console.log('videoData?.fullDescription', videoData?.fullDescription);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          width: '100%',
        }}
      >
        {videoReference ? (
          <VideoPlayerContainer
            sx={{
              height: '70vh',
              backgroundColor: 'black',
            }}
          >
            <VideoPlayer
              name={videoReference?.name}
              service={videoReference?.service}
              identifier={videoReference?.identifier}
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
            sx={{ width: '100%', height: '70vh', background: 'black' }}
          ></Box>
        )}
        <VideoContentContainer
          sx={{ paddingLeft: isScreenSmall ? '5px' : '0px' }}
        >
          <VideoTitle
            variant={isScreenSmall ? 'h2' : 'h4'}
            color="textPrimary"
            sx={{
              textAlign: 'start',
              marginTop: isScreenSmall ? '20px' : '10px',
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
                {formatDate(videoData.created)}
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
            channelName={channelName}
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
          {/* {videoData?.fullDescription && (
            <Box
              sx={{
                background: '#333333',
                borderRadius: '5px',
                padding: '5px',
                width: '95%',
                cursor: !descriptionHeight
                  ? 'default'
                  : isExpandedDescription
                    ? 'default'
                    : 'pointer',
                position: 'relative',
                marginBottom: '30px',
              }}
              className={
                !descriptionHeight
                  ? ''
                  : isExpandedDescription
                    ? ''
                    : 'hover-click'
              }
            >
              {descriptionHeight && !isExpandedDescription && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    left: '0px',
                    bottom: '0px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (isExpandedDescription) return;
                    setIsExpandedDescription(true);
                  }}
                />
              )}
              <Box
                ref={contentRef}
                sx={{
                  height: !descriptionHeight
                    ? 'auto'
                    : isExpandedDescription
                      ? 'auto'
                      : '200px',
                  overflow: 'hidden',
                }}
              >
                {videoData?.htmlDescription ? (
                  <DisplayHtml html={videoData?.htmlDescription} />
                ) : (
                  <VideoDescription
                    variant="body1"
                    color="textPrimary"
                    sx={{
                      cursor: 'default',
                    }}
                  >
                    {videoData?.fullDescription}
                  </VideoDescription>
                )}
              </Box>
              {descriptionHeight >= descriptionThreshold && (
                <Typography
                  onClick={() => {
                    setIsExpandedDescription((prev) => !prev);
                  }}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    paddingLeft: '15px',
                    paddingTop: '15px',
                  }}
                >
                  {isExpandedDescription ? 'Show less' : '...more'}
                </Typography>
              )}
            </Box>
          )} */}

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
    </>
  );
};
