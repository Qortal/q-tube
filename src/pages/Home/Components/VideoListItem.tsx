import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Tooltip, Typography, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';
import {
  QortalMetadata,
  showError,
  useGlobal,
  useProgressStore,
} from 'qapp-core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlaylistSVG } from '../../../assets/svgs/PlaylistSVG';
import { VideoMetadata } from '../../../components/Publish/PublishVideo/useVideoPublishingWorkflow.tsx';
import ResponsiveImage from '../../../components/ResponsiveImage';
import { fontSizeSmall, minDuration } from '../../../constants/Misc';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { editPlaylistAtom } from '../../../state/publish/playlist';
import { formatTime, formatBytes } from '../../../utils/numberFunctions';
import { formatDate } from '../../../utils/time';
import { VideoCardImageContainer } from './VideoCardImageContainer';
import {
  BlockIconContainer,
  BottomParent,
  IconsBox,
  InlineName,
  InvalidVideoCardTitle,
  NameContainer,
  VideoCard,
  VideoCardCol,
  VideoCardName,
  VideoCardTitle,
  VideoUploadDate,
} from './VideoList-styles';

interface VideoListItemProps {
  qortalMetadata: QortalMetadata;
  video: VideoMetadata & { image: string };
  username: string | null;
  blockUserFunc: (user: string) => void;
  setEditVideo: (data: any) => void;
  isBookmarks?: boolean;
  disableActions?: boolean;
  handleRemoveVideoFromList?: (data: any[]) => void;
  // When true, the card is rendered with a red strikethrough title and a
  // hover tooltip telling the owner the publish is invalid and needs
  // editing. Navigation is disabled so the owner can't open a broken
  // video/playlist, but edit/delete actions stay enabled.
  isInvalid?: boolean;
}

const INVALID_TOOLTIP = 'This video is invalid, please edit it';

export const VideoListItem = ({
  qortalMetadata,
  video,
  username,
  blockUserFunc,
  setEditVideo,
  isBookmarks,
  disableActions,
  handleRemoveVideoFromList,
  isInvalid,
}: VideoListItemProps) => {
  const { t, i18n } = useTranslation(['core']);

  const isMobile = useIsMobile();

  const navigate = useNavigate();
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const theme = useTheme();
  const { lists } = useGlobal();
  const { getProgress, progressMap } = useProgressStore();

  const { deleteResource } = lists;
  const setEditPlaylist = useSetAtom(editPlaylistAtom);

  const isPlaylist = qortalMetadata?.service === 'PLAYLIST';

  // Calculate video progress for progress bar
  // Use progressMap directly to avoid hydration race condition
  // Key format: VIDEO-name-identifier
  // For reference videos, use video.videoReference; otherwise use qortalMetadata
  // VideoPlayer stores progress with VIDEO service, not DOCUMENT
  const progressRef = video?.videoReference || {
    service: 'VIDEO',
    name: qortalMetadata?.name,
    identifier: qortalMetadata?.identifier?.replace('_metadata', ''),
  };
  const progressKey = `${progressRef.service}-${progressRef.name}-${progressRef.identifier}`;
  const savedTime = progressMap[progressKey] ?? 0;
  const hasProgress = Boolean(video?.duration) && savedTime > 0;
  const progressPercent = hasProgress
    ? Math.min((savedTime / video.duration) * 100, 100)
    : 0;

  const handleVideoClick = () => {
    if (isInvalid) return;
    navigate(
      `/video/${encodeURIComponent(qortalMetadata?.name)}/${qortalMetadata?.identifier}`
    );
  };

  if (isPlaylist) {
    return (
      <VideoCardCol
        key={qortalMetadata?.identifier}
        onMouseEnter={() => setShowIcons(!!qortalMetadata?.identifier)}
        onMouseLeave={() => setShowIcons(false)}
        sx={{
          ...(isMobile && {
            width: '100%',
            borderRadius: '0px',
            maxWidth: '100%',
          }),
        }}
      >
        <IconsBox
          sx={{
            opacity: showIcons === !!qortalMetadata?.identifier ? 1 : 0,
            zIndex: 2,
          }}
        >
          {qortalMetadata?.name === username &&
            !isBookmarks &&
            !disableActions && (
              <Tooltip
                title={t('core:publish.edit_playlist', {
                  postProcess: 'capitalizeFirstChar',
                })}
                placement="top"
              >
                <BlockIconContainer>
                  <EditIcon
                    onClick={() => {
                      const resourceData = {
                        title: qortalMetadata?.metadata?.title,
                        category: qortalMetadata?.metadata?.category,
                        categoryName: qortalMetadata?.metadata?.categoryName,
                        tags: qortalMetadata?.metadata?.tags || [],
                        description: qortalMetadata?.metadata?.description,
                        created: qortalMetadata?.created,
                        updated: qortalMetadata?.updated,
                        name: qortalMetadata.name,
                        videoImage: '',
                        identifier: qortalMetadata.identifier,
                        service: qortalMetadata.service,
                      };
                      setEditPlaylist({ ...resourceData, ...video });
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}

          {qortalMetadata?.name === username &&
            !isBookmarks &&
            !disableActions && (
              <Tooltip
                title={t('core:publish.delete_playlist', {
                  postProcess: 'capitalizeFirstChar',
                })}
                placement="top"
              >
                <BlockIconContainer>
                  <DeleteIcon
                    onClick={async () => {
                      try {
                        await deleteResource([qortalMetadata]);
                      } catch (error) {
                        console.error('Error deleting playlist:', error);
                      }
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}

          {qortalMetadata?.name !== username &&
            !isBookmarks &&
            !disableActions && (
              <Tooltip
                title={t('core:publish.block_user_content', {
                  postProcess: 'capitalizeFirstChar',
                })}
                placement="top"
              >
                <BlockIconContainer>
                  <BlockIcon
                    onClick={() => {
                      blockUserFunc(qortalMetadata?.name);
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}
          {isBookmarks && handleRemoveVideoFromList && !disableActions && (
            <Tooltip
              title={t('core:publish.remove_playlist_list', {
                postProcess: 'capitalizeFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <DeleteIcon
                  onClick={() => {
                    handleRemoveVideoFromList([
                      qortalMetadata,
                      video.videoReference,
                    ]);
                  }}
                />
              </BlockIconContainer>
            </Tooltip>
          )}
        </IconsBox>

        <VideoCard
          onClick={() => {
            if (isInvalid) return;
            navigate(
              `/playlist/${encodeURIComponent(qortalMetadata?.name)}/${qortalMetadata?.identifier}`
            );
          }}
          sx={{
            height: '100%',
            cursor: isInvalid ? 'not-allowed' : 'pointer',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: 180,
              width: isMobile ? '100%' : 320,
            }}
          >
            <ResponsiveImage
              src={video?.image}
              width={320}
              height={180}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
              }}
            />
          </Box>
          {isInvalid ? (
            <Tooltip title={INVALID_TOOLTIP} placement="top">
              <InvalidVideoCardTitle>{video?.title}</InvalidVideoCardTitle>
            </Tooltip>
          ) : (
            <VideoCardTitle>{video?.title}</VideoCardTitle>
          )}
          <BottomParent
            sx={{
              padding: isMobile ? '0px 5px' : '0px',
            }}
          >
            <NameContainer
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/channel/${encodeURIComponent(qortalMetadata?.name)}/videos`
                );
              }}
            >
              <Avatar
                sx={{
                  height: 24,
                  width: 24,
                  transition: 'scale 0.2s',
                  ':hover': {
                    scale: 1.05,
                  },
                }}
                src={`/arbitrary/THUMBNAIL/${encodeURIComponent(qortalMetadata?.name)}/qortal_avatar`}
                alt={`${qortalMetadata?.name}'s avatar`}
              />
              <VideoCardName
                sx={{
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {qortalMetadata?.name}
              </VideoCardName>

              {qortalMetadata?.created && (
                <VideoUploadDate>
                  {formatDate(qortalMetadata.created, i18n.language)}
                </VideoUploadDate>
              )}
            </NameContainer>
            <Box
              sx={{
                display: 'flex',
                position: 'absolute',
                bottom: '5px',
                right: '5px',
              }}
            >
              <PlaylistSVG
                color={theme.palette.text.primary}
                height="36px"
                width="36px"
              />
            </Box>
          </BottomParent>
        </VideoCard>
      </VideoCardCol>
    );
  }
  return (
    <VideoCardCol
      key={qortalMetadata?.identifier}
      onMouseEnter={() => setShowIcons(!!qortalMetadata?.identifier)}
      onMouseLeave={() => setShowIcons(false)}
      sx={{
        ...(isMobile && {
          width: '100%',
          borderRadius: '0px',
          maxWidth: '100%',
        }),
      }}
    >
      <IconsBox
        sx={{
          opacity: showIcons === !!qortalMetadata.identifier ? 1 : 0,
          zIndex: 2,
        }}
      >
        {qortalMetadata?.name === username &&
          !isBookmarks &&
          !disableActions && (
            <Tooltip
              title={t('core:publish.edit_video', {
                postProcess: 'capitalizeFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <EditIcon
                  onClick={() => {
                    const resourceData = {
                      title: qortalMetadata?.metadata?.title,
                      category: qortalMetadata?.metadata?.category,
                      categoryName: qortalMetadata?.metadata?.categoryName,
                      tags: qortalMetadata?.metadata?.tags || [],
                      description: qortalMetadata?.metadata?.description,
                      created: qortalMetadata?.created,
                      updated: qortalMetadata?.updated,
                      user: qortalMetadata.name,
                      videoImage: '',
                      id: qortalMetadata.identifier,
                    };

                    setEditVideo({ ...resourceData, ...video });
                  }}
                />
              </BlockIconContainer>
            </Tooltip>
          )}

        {qortalMetadata?.name !== username &&
          !isBookmarks &&
          !disableActions && (
            <Tooltip
              title={t('core:publish.block_user_content', {
                postProcess: 'capitalizeFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <BlockIcon
                  onClick={() => {
                    blockUserFunc(qortalMetadata?.name);
                  }}
                />
              </BlockIconContainer>
            </Tooltip>
          )}
        {qortalMetadata?.name === username &&
          !isBookmarks &&
          !disableActions && (
            <Tooltip
              title={t('core:publish.delete_video', {
                postProcess: 'capitalizeFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <DeleteIcon
                  onClick={() => {
                    if (video?.videoReference)
                      deleteResource([qortalMetadata, video.videoReference]);
                    else {
                      showError(
                        "Can\'t delete video. VideoReference is undefined"
                      );
                    }
                  }}
                />
              </BlockIconContainer>
            </Tooltip>
          )}
        {isBookmarks && handleRemoveVideoFromList && !disableActions && (
          <Tooltip
            title={t('core:publish.remove_video_list', {
              postProcess: 'capitalizeFirstChar',
            })}
            placement="top"
          >
            <BlockIconContainer>
              <DeleteIcon
                onClick={() => {
                  handleRemoveVideoFromList([
                    qortalMetadata,
                    video.videoReference,
                  ]);
                }}
              />
            </BlockIconContainer>
          </Tooltip>
        )}
      </IconsBox>
      <VideoCard
        onClick={handleVideoClick}
        sx={{ cursor: isInvalid ? 'not-allowed' : 'pointer' }}
      >
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <VideoCardImageContainer
            width={isMobile ? '100%' : 320}
            height={180}
            videoImage={video.videoImage}
            frameImages={video?.extracts || []}
          />
          {Boolean(video?.duration) && video?.duration > minDuration && (
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
                {formatTime(video.duration)}
              </Typography>
            </Box>
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
        </Box>

        <BottomParent
          sx={{
            padding: isMobile ? '0px 5px' : '0px',
          }}
        >
          <NameContainer>
            <Avatar
              sx={{
                height: 40,
                width: 40,
                transition: 'scale 0.2s',
                ':hover': {
                  scale: 1.05,
                },
              }}
              src={`/arbitrary/THUMBNAIL/${encodeURIComponent(qortalMetadata?.name)}/qortal_avatar`}
              alt={`${qortalMetadata?.name}'s avatar`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/channel/${encodeURIComponent(qortalMetadata?.name)}/videos`
                );
              }}
            />
            <Tooltip
              title={isInvalid ? INVALID_TOOLTIP : video.title}
              placement="top"
              slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
            >
              {isInvalid ? (
                <InvalidVideoCardTitle variant="body2">
                  {video.title}
                </InvalidVideoCardTitle>
              ) : (
                <VideoCardTitle variant="body2">{video.title}</VideoCardTitle>
              )}
            </Tooltip>
          </NameContainer>
          {qortalMetadata?.created && (
            <Box
              sx={{
                flexDirection: 'row',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '15px',
              }}
            >
              <VideoUploadDate sx={{ display: 'inline', fontWeight: 500 }}>
                <InlineName
                  sx={{}}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/channel/${encodeURIComponent(qortalMetadata?.name)}/videos`
                    );
                  }}
                >
                  {qortalMetadata?.name}
                </InlineName>{' '}
                | {formatDate(qortalMetadata.created, i18n.language)}
              </VideoUploadDate>
              {video?.fileSize && (
                <VideoUploadDate
                  sx={{
                    display: 'inline',
                    fontWeight: 500,
                    marginRight: '10px',
                  }}
                >
                  {formatBytes(video?.fileSize)}
                </VideoUploadDate>
              )}
            </Box>
          )}
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
};
