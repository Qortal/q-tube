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

export const VideoListItem = ({
  qortalMetadata,
  video,
  username,
  blockUserFunc,
  setEditVideo,
}) => {
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
      >
        <IconsBox
          sx={{
            opacity: showIcons === qortalMetadata?.identifier ? 1 : 0,
            zIndex: 2,
          }}
        >
          {qortalMetadata?.name === username && (
            <Tooltip title="Edit playlist" placement="top">
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

          {qortalMetadata?.name !== username && (
            <Tooltip title="Block user content" placement="top">
              <BlockIconContainer>
                <BlockIcon
                  onClick={() => {
                    blockUserFunc(qortalMetadata?.name);
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
        >
          <div
            style={{
              height: 480,
              width: 320,
              maxHeight: '50vh',
              maxWidth: '100%',
              position: 'relative',
              overflow: 'hidden',
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
              fill={true}
            />
          </div>
          <VideoCardTitle>{video?.title}</VideoCardTitle>
          <BottomParent>
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
                  {formatDate(qortalMetadata.created)}
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
    >
      <IconsBox
        sx={{
          opacity: showIcons === qortalMetadata.identifier ? 1 : 0,
          zIndex: 2,
        }}
      >
        {qortalMetadata?.name === username && (
          <Tooltip title="Edit video properties" placement="top">
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

        {qortalMetadata?.name !== username && (
          <Tooltip title="Block user content" placement="top">
            <BlockIconContainer>
              <BlockIcon
                onClick={() => {
                  blockUserFunc(qortalMetadata?.name);
                }}
              />
            </BlockIconContainer>
          </Tooltip>
        )}
        {qortalMetadata?.name === username && (
          <Tooltip title="Delete video" placement="top">
            <BlockIconContainer>
              <DeleteIcon
                onClick={() => {
                  deleteResource([qortalMetadata, video.videoReference]);
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
            width={320}
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
                // backgroundColor: '#050507',
              }}
            >
              <Typography variant="body2">
                {formatTime(video.duration)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* <Tooltip
          title={video.title}
          placement="top"
          slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
        >
          <VideoCardTitle>{video.title}</VideoCardTitle>
        </Tooltip> */}
        <BottomParent>
          <NameContainer
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/channel/${qortalMetadata?.name}`);
            }}
          >
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
            />
            <Tooltip
              title={video.title}
              placement="top"
              slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
            >
              <VideoCardTitle variant="body2">{video.title}</VideoCardTitle>
            </Tooltip>
            {/* <VideoCardName
              sx={{
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {qortalMetadata?.name}
            </VideoCardName> */}
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
                | {formatDate(qortalMetadata.created)}
              </VideoUploadDate>
            </Box>
          )}
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
};
