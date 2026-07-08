import {
  Box,
  Divider,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Service, useProgressStore } from 'qapp-core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CommentSection } from '../../../components/common/Comments/CommentSection.tsx';
import { PageTransition } from '../../../components/common/PageTransition.tsx';
import { SuperLikesSection } from '../../../components/common/SuperLikesList/SuperLikesSection.tsx';
import { VideoPlayer } from '../../../components/common/VideoPlayer/VideoPlayer.tsx';
import { Playlists } from '../../../components/Playlists/Playlists.tsx';
import { minDuration, minFileSize } from '../../../constants/Misc.ts';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { formatBytes, formatTime } from '../../../utils/numberFunctions.ts';
import { formatDate } from '../../../utils/time.ts';
import { VideoActionsBar } from '../VideoContent/VideoActionsBar.tsx';
import { VideoContentContainer } from '../VideoContent/VideoContent-styles.tsx';
import { CollapsibleDescription } from '../VideoContent/VideoContent.tsx';
import { usePlaylistContentState } from './PlaylistContent-State.ts';
import {
  Spacer,
  VideoPlayerContainer,
  VideoTitle,
} from './PlaylistContent-styles.tsx';

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
    nextVideo,
    onEndVideo,
    doAutoPlay,
    playlistData,
    setSuperLikeList,
    loadingSuperLikes,
  } = usePlaylistContentState();
  const { t, i18n } = useTranslation(['core']);

  // Saved playback progress - blue bar at bottom of player, initial state only
  // (before video clicked/started). Key matches qapp-core player store:
  // `${service}-${name}-${identifier}` (VIDEO service reference).
  const { progressMap } = useProgressStore();
  // Track which video was started by key (not a boolean). This auto-resets
  // when the current video changes (different key), so the bar reappears for
  // each new playlist video without an effect or remount.
  const [startedVideoKey, setStartedVideoKey] = useState<string | null>(null);

  const progressKey = videoReference
    ? `${videoReference.service}-${videoReference.name}-${videoReference.identifier}`
    : '';
  const hasStarted = !!progressKey && startedVideoKey === progressKey;
  const savedTime = progressKey ? progressMap[progressKey] ?? 0 : 0;
  const videoDuration = videoData?.duration;
  // Match VideoListItem gating: duration present + saved time > 0.
  // No upper-bound check (Math.min clamps percent); avoids hiding bar on
  // fully-watched or rounding-edge videos.
  const hasProgress = !hasStarted && !!videoDuration && savedTime > 0;
  const progressPercent = hasProgress
    ? Math.min((savedTime / videoDuration) * 100, 100)
    : 0;

  const navigate = useNavigate();
  const isSmall = useIsSmall();
  const isScreenSmall = !useMediaQuery(`(min-width:950px)`);
  const { s, n, i } = useParams();
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
            <Typography>
              {t('core:publish.playlist_not_exist', {
                postProcess: 'capitalizeFirstChar',
              })}
            </Typography>
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
                  position: 'relative',
                }}
              >
                {videoReference && (
                  <VideoPlayer
                    created={videoData?.created}
                    name={videoReference?.name}
                    service={videoReference?.service}
                    identifier={videoReference?.identifier}
                    user={videoData?.user}
                    jsonId={videoData?.id}
                    poster={videoCover || ''}
                    nextVideo={nextVideo}
                    onEnd={onEndVideo}
                    autoPlay={doAutoPlay}
                    videoStyles={{
                      video: { aspectRatio: '16 / 9' },
                    }}
                    duration={videoData?.duration}
                    filename={videoData?.filename}
                    onStart={() => setStartedVideoKey(progressKey)}
                  />
                )}
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
                        if (!channelName) return;
                        navigate(
                          `/playlist/${encodeURIComponent(channelName)}/${id}/DOCUMENT/${encodeURIComponent(name)}/${identifier}`
                        );
                      }}
                      // sx={playlistsSX}
                    />
                  )}
                </Box>
              )}
            </VideoPlayerContainer>
            <VideoContentContainer
              sx={{ padding: isSmall ? '5px' : '0px', width: '100%' }}
            >
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
                      if (!channelName) return;
                      navigate(
                        `/playlist/${encodeURIComponent(channelName)}/${id}/DOCUMENT/${encodeURIComponent(name)}/${identifier}`
                      );
                    }}
                    // sx={playlistsSX}
                  />
                </Box>
              )}
              <VideoActionsBar
                channelName={channelName || ''}
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
                    {formatDate(videoData.created, i18n.language)}
                  </Typography>
                )}
                <Divider orientation="vertical" flexItem />
                {!!videoData?.fileSize && videoData.fileSize > minFileSize && (
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
