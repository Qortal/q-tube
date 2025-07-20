import { Box, SxProps, Theme, Typography, useMediaQuery } from '@mui/material';
import { CommentSection } from '../../../components/common/Comments/CommentSection.tsx';
import { SuperLikesSection } from '../../../components/common/SuperLikesList/SuperLikesSection.tsx';
import { DisplayHtml } from '../../../components/common/TextEditor/DisplayHtml.tsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer/VideoPlayer.tsx';
import { Playlists } from '../../../components/Playlists/Playlists.tsx';
import { fontSizeSmall, minFileSize } from '../../../constants/Misc.ts';
import { formatBytes } from '../../../utils/numberFunctions.ts';
import { formatDate } from '../../../utils/time.ts';
import { VideoActionsBar } from '../VideoContent/VideoActionsBar.tsx';
import { usePlaylistContentState } from './PlaylistContent-State.ts';
import {
  Spacer,
  VideoDescription,
  VideoPlayerContainer,
  VideoTitle,
} from './PlaylistContent-styles.tsx';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Service } from 'qapp-core';
import { PageTransition } from '../../../components/common/PageTransition.tsx';

export const PlaylistContent = () => {
  const {
    channelName,
    id,
    videoData,
    superLikeList,
    setVideoMetadataResource,
    videoReference,
    videoCover,
    theme,
    descriptionHeight,
    nextVideo,
    onEndVideo,
    doAutoPlay,
    playlistData,
    setSuperLikeList,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
  } = usePlaylistContentState();
  const navigate = useNavigate();
  const isScreenSmall = !useMediaQuery(`(min-width:950px)`);
  const { s, n, i } = useParams();
  console.log({ s, n, i });
  const playlistsSX: SxProps<Theme> = isScreenSmall
    ? { width: '100%', marginTop: '10px' }
    : { width: '35%', position: 'absolute', right: '20px' };

  useEffect(() => {
    if (s && n && i && videoData) {
      setVideoMetadataResource({
        name: n,
        identifier: i,
        service: s as Service,
      });
    }
  }, [s, n, i, videoData]);

  return (
    <PageTransition>
      <>
        {videoData && videoData?.videos?.length === 0 ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            <Typography>This playlist doesn't exist</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '0px',
              width: '100%',
            }}
          >
            <VideoPlayerContainer
              sx={{
                alignSelf: 'start',
                paddingRight: isScreenSmall ? '10px' : '0px',
                marginBottom: '20px',
                height: '70vh',
                flexDirection: 'row',
                width: '100%',
                gap: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  flexBasis: '75%',
                }}
              >
                {videoReference && (
                  <VideoPlayer
                    name={videoReference?.name}
                    service={videoReference?.service}
                    identifier={videoReference?.identifier}
                    user={channelName}
                    jsonId={id}
                    poster={videoCover || ''}
                    nextVideo={nextVideo}
                    onEnd={onEndVideo}
                    autoPlay={doAutoPlay}
                    videoStyles={{
                      video: { aspectRatio: '16 / 9' },
                    }}
                    duration={videoData?.duration}
                    filename={videoData?.filename}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  height: '100%',
                  overflow: 'auto',
                  '::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },

                  '::-webkit-scrollbar': {
                    width: '16px',
                    height: '10px',
                  },

                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(63, 67, 80, 0.24)',
                    borderRadius: '8px',
                    backgroundClip: 'content-box',
                    border: '4px solid transparent',
                    transition: '0.3s background-color',
                  },
                  '::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: 'rgba(63, 67, 80, 0.50)',
                  },
                }}
              >
                {playlistData && (
                  <Playlists
                    playlistData={playlistData}
                    currentVideoIdentifier={videoData?.id}
                    onClick={(name, identifier) => {
                      navigate(
                        `/playlist/${channelName}/${id}/DOCUMENT/${name}/${identifier}`
                      );
                    }}
                    // sx={playlistsSX}
                  />
                )}
              </Box>
            </VideoPlayerContainer>
            <VideoActionsBar
              channelName={channelName}
              videoData={videoData}
              videoReference={videoReference}
              superLikeList={superLikeList}
              setSuperLikeList={setSuperLikeList}
              sx={{ width: '100%' }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: '10px',
                gap: '10px',
              }}
            >
              <VideoTitle
                variant="h1"
                color="textPrimary"
                sx={{
                  textAlign: 'center',
                }}
              >
                {videoData?.title}
              </VideoTitle>
            </Box>

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                gap: '20px',
              }}
            >
              {videoData?.created && (
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: fontSizeSmall,
                  }}
                  color={theme.palette.text.primary}
                >
                  {formatDate(videoData.created)}
                </Typography>
              )}
              {videoData?.fileSize > minFileSize && (
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '90%',
                  }}
                  color={'green'}
                >
                  {formatBytes(videoData.fileSize, 2, 'Decimal')}
                </Typography>
              )}
            </Box>
            <Spacer height="30px" />
            {videoData?.fullDescription && (
              <Box
                sx={{
                  background: '#333333',
                  borderRadius: '5px',
                  padding: '5px',
                  width: '95%',
                  alignSelf: 'flex-start',
                  cursor: !descriptionHeight
                    ? 'default'
                    : isExpandedDescription
                      ? 'default'
                      : 'pointer',
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
                        : `${descriptionHeight}px`,
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
            )}
            {videoData?.id && videoData?.user && (
              <SuperLikesSection
                loadingSuperLikes={loadingSuperLikes}
                superlikes={superLikeList}
                postId={videoData?.id || ''}
                postName={videoData?.user || ''}
              />
            )}
            {videoData?.id && channelName && (
              <CommentSection
                postId={videoData?.id || ''}
                postName={channelName || ''}
              />
            )}
          </Box>
        )}
      </>
    </PageTransition>
  );
};
