import {
  Box,
  Divider,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
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
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { VideoContentContainer } from '../VideoContent/VideoContent-styles.tsx';
import { CollapsibleDescription } from '../VideoContent/VideoContent.tsx';

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
  const isSmall = useIsSmall();
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
                height: isSmall ? '240px' : '70vh',
                maxHeight: '70vh',
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
              {!isSmall && (
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
              )}
            </VideoPlayerContainer>
            <VideoContentContainer sx={{ padding: isSmall ? '5px' : '0px' }}>
              {playlistData && isSmall && (
                <Box
                  sx={{
                    maxHeight: '175px',
                    overflow: 'auto',
                    overflowY: 'scroll',
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
                </Box>
              )}
              <VideoActionsBar
                channelName={channelName}
                videoData={videoData}
                videoReference={videoReference}
                superLikeList={superLikeList}
                setSuperLikeList={setSuperLikeList}
                sx={{ width: '100%' }}
              />

              <VideoTitle
                variant={'h4'}
                color="textPrimary"
                sx={{
                  textAlign: 'start',
                  marginTop: isSmall ? '20px' : '10px',
                  fontSize: isSmall ? '18px' : 'unset',
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
              <Spacer height="15px" />
              {videoData?.htmlDescription ? (
                <CollapsibleDescription html={videoData?.htmlDescription} />
              ) : (
                <CollapsibleDescription text={videoData?.fullDescription} />
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
            </VideoContentContainer>
          </Box>
        )}
      </>
    </PageTransition>
  );
};
