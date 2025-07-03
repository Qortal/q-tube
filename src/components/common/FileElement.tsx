import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ButtonBase, CircularProgress, Popover } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useResourceStatus } from 'qapp-core';
import { useLocation } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

import {
  AltertObject,
  setNotificationAtom,
} from '../../state/global/notifications';

const Widget = styled('div')(({ theme }) => ({
  padding: 8,
  borderRadius: 10,
  maxWidth: 350,
  position: 'relative',
  zIndex: 1,
  backdropFilter: 'blur(40px)',
  background: 'skyblue',
  transition: '0.2s all',
  '&:hover': {
    opacity: 0.75,
  },
}));

const CoverImage = styled('div')({
  width: 40,
  height: 40,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

interface IAudioElement {
  title: string;
  description?: string;
  author?: string;
  fileInfo?: any;
  postId?: string;
  user?: string;
  children?: React.ReactNode;
  mimeType?: string;
  disable?: boolean;
  mode?: string;
  otherUser?: string;
  customStyles?: any;
}

export default function FileElement({
  title,
  description,
  author,
  fileInfo,
  mimeType,
  disable,
  customStyles,
}: IAudioElement) {
  const [startedDownload, setStartedDownload] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [downloadLoader, setDownloadLoader] = React.useState<any>(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const setNotification = useSetAtom(setNotificationAtom);
  const resourceStatus = useResourceStatus({
    resource: startedDownload ? fileInfo : null,
    path: location.pathname,
    filename: fileInfo?.filename,
  });
  const handlePlay = async () => {
    if (disable) return;
    setStartedDownload(true);
    if (resourceStatus?.isReady) {
      if (downloadLoader) return;

      try {
        await qortalRequest({
          action: 'SAVE_FILE',
          location: fileInfo,
          filename: fileInfo?.filename,
        });
      } catch (error) {
        const isError = error instanceof Error;
        const message = isError ? error?.message : 'Failed to save file';
        const notificationObj: AltertObject = {
          msg: message,
          alertType: 'error',
        };
        setNotification(notificationObj);
      }
      return;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box
      // onClick={handlePlay}
      sx={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        ...(customStyles || {}),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <ButtonBase onClick={handleClick}>
          {resourceStatus?.status === 'READY' ? <SaveIcon /> : <DownloadIcon />}
        </ButtonBase>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box
            sx={{
              width: '240px',
              height: '75px',
              padding: '10px',
            }}
          >
            <ButtonBase
              onClick={handlePlay}
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',

                padding: '5px',
              }}
            >
              {resourceStatus?.status === 'READY' ? (
                <SaveIcon />
              ) : (
                <DownloadIcon />
              )}

              {resourceStatus.status &&
              resourceStatus?.status !== 'READY' &&
              startedDownload ? (
                <>
                  <CircularProgress color="secondary" size={14} />
                  <Typography variant="body2">{`${Math.round(
                    resourceStatus?.percentLoaded || 0
                  ).toFixed(0)}% loaded`}</Typography>
                </>
              ) : resourceStatus?.status === 'READY' ? (
                <>
                  <Typography
                    sx={{
                      fontSize: '14px',
                    }}
                  >
                    Ready to save: click here
                  </Typography>
                  {downloadLoader && (
                    <CircularProgress color="secondary" size={14} />
                  )}
                </>
              ) : null}
              {!startedDownload && (
                <Typography
                  sx={{
                    fontSize: '14px',
                  }}
                >
                  Start download: click here
                </Typography>
              )}
            </ButtonBase>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
