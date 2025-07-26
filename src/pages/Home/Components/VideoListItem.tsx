import { Avatar, Box, Tooltip, Typography, useTheme } from '@mui/material';
import {
  BlockIconContainer,
  BottomParent,
  IconsBox,
  InlineName,
  NameContainer,
  VideoCard,
  VideoCardCol,
  VideoCardName,
  VideoCardTitle,
  VideoUploadDate,
} from './VideoList-styles';
import ResponsiveImage from '../../../components/ResponsiveImage';
import { PlaylistSVG } from '../../../assets/svgs/PlaylistSVG';
import { formatTime } from '../../../utils/numberFunctions';
import { VideoCardImageContainer } from './VideoCardImageContainer';
import { fontSizeSmall, minDuration } from '../../../constants/Misc';
import { formatDate } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import { useGlobal } from 'qapp-core';
import { useState } from 'react';
import { editPlaylistAtom } from '../../../state/publish/playlist';
import { useSetAtom } from 'jotai';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

export const VideoListItem = ({
  qortalMetadata,
  video,
  username,
  blockUserFunc,
  setEditVideo,
  isBookmarks,
  disableActions,
  handleRemoveVideoFromList,
}: any) => {
  const { t, i18n } = useTranslation(['core']);

  const isMobile = useIsMobile();

  const navigate = useNavigate();
  const [showIcons, setShowIcons] = useState(null);
  const theme = useTheme();
  const { lists } = useGlobal();

  const { deleteResource } = lists;
  const setEditPlaylist = useSetAtom(editPlaylistAtom);

  const isPlaylist = qortalMetadata?.service === 'PLAYLIST';

  if (isPlaylist) {
    return (
      <VideoCardCol
        key={qortalMetadata?.identifier}
        onMouseEnter={() => setShowIcons(qortalMetadata?.identifier)}
        onMouseLeave={() => setShowIcons(null)}
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
            opacity: showIcons === qortalMetadata?.identifier ? 1 : 0,
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
            navigate(
              `/playlist/${qortalMetadata?.name}/${qortalMetadata?.identifier}`
            );
          }}
          sx={{
            height: '100%',
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
          <VideoCardTitle>{video?.title}</VideoCardTitle>
          <BottomParent
            sx={{
              padding: isMobile ? '0px 5px' : '0px',
            }}
          >
            <NameContainer
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${qortalMetadata?.name}`);
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
                src={`/arbitrary/THUMBNAIL/${qortalMetadata?.name}/qortal_avatar`}
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
      onMouseEnter={() => setShowIcons(qortalMetadata?.identifier)}
      onMouseLeave={() => setShowIcons(null)}
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
          opacity: showIcons === qortalMetadata.identifier ? 1 : 0,
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
                    deleteResource([qortalMetadata, video.videoReference]);
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
        onClick={() => {
          navigate(
            `/video/${qortalMetadata?.name}/${qortalMetadata?.identifier}`
          );
        }}
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
          {video?.duration > minDuration && (
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
              src={`/arbitrary/THUMBNAIL/${qortalMetadata?.name}/qortal_avatar`}
              alt={`${qortalMetadata?.name}'s avatar`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${qortalMetadata?.name}`);
              }}
            />
            <Tooltip
              title={video.title}
              placement="top"
              slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
            >
              <VideoCardTitle variant="body2">{video.title}</VideoCardTitle>
            </Tooltip>
          </NameContainer>
          {qortalMetadata?.created && (
            <Box
              sx={{
                flexDirection: 'row',
                width: '100%',
                display: 'flex',
                gap: '15px',
              }}
            >
              <Box
                sx={{
                  width: '40px',
                }}
              />
              <VideoUploadDate sx={{ display: 'inline', fontWeight: 500 }}>
                <InlineName
                  sx={{}}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${qortalMetadata?.name}`);
                  }}
                >
                  {qortalMetadata?.name}
                </InlineName>{' '}
                | {formatDate(qortalMetadata.created, i18n.language)}
              </VideoUploadDate>
            </Box>
          )}
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
};
