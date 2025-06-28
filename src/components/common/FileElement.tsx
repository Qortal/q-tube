import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useResourceStatus } from 'qapp-core';
import { useLocation } from 'react-router-dom';
import { useSetAtom } from 'jotai';
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
  children,
  mimeType,
  disable,
  customStyles,
}: IAudioElement) {
  const [startedDownload, setStartedDownload] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [downloadLoader, setDownloadLoader] = React.useState<any>(false);
  const location = useLocation();
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

      setDownloadLoader(true);

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
      } finally {
        setDownloadLoader(false);
      }
      return;
    }

    setIsLoading(true);
  };

  React.useEffect(() => {
    if (resourceStatus?.isReady) {
      setIsLoading(false);
      const notificationObj: AltertObject = {
        msg: 'Download completed. Click to save file',
        alertType: 'info',
      };
      setNotification(notificationObj);
    }
  }, [resourceStatus?.isReady]);

  return (
    <Box
      onClick={handlePlay}
      sx={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        ...(customStyles || {}),
      }}
    >
      {children && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            gap: '7px',
          }}
        >
          {children}{' '}
          {((resourceStatus.status && resourceStatus?.status !== 'READY') ||
            isLoading) &&
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
        </Box>
      )}
      {!children && (
        <Widget>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CoverImage>
              <AttachFileIcon
                sx={{
                  width: '90%',
                  height: 'auto',
                }}
              />
            </CoverImage>
            <Box sx={{ ml: 1.5, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {author}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: '16px',
                }}
              >
                <b>{title}</b>
              </Typography>
              <Typography
                noWrap
                letterSpacing={-0.25}
                sx={{
                  fontSize: '14px',
                }}
              >
                {description}
              </Typography>
              {mimeType && (
                <Typography
                  noWrap
                  letterSpacing={-0.25}
                  sx={{
                    fontSize: '12px',
                  }}
                >
                  {mimeType}
                </Typography>
              )}
            </Box>
          </Box>
          {((resourceStatus.status && resourceStatus?.status !== 'READY') ||
            isLoading) &&
            startedDownload && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                zIndex={4999}
                bgcolor="rgba(0, 0, 0, 0.6)"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '10px',
                }}
              >
                <CircularProgress color="secondary" />
                {resourceStatus && (
                  <Typography
                    variant="subtitle2"
                    component="div"
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {resourceStatus?.status === 'REFETCHING' ? (
                      <>
                        <>{resourceStatus?.percentLoaded?.toFixed(0)}%</>

                        <> Refetching in 2 minutes</>
                      </>
                    ) : resourceStatus?.status === 'DOWNLOADED' ? (
                      <>Download Completed: building file...</>
                    ) : resourceStatus?.status !== 'READY' ? (
                      <>{resourceStatus?.percentLoaded?.toFixed(0)}%</>
                    ) : (
                      <>Download Completed: fetching file...</>
                    )}
                  </Typography>
                )}
              </Box>
            )}
          {resourceStatus?.isReady && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              justifyContent="center"
              alignItems="center"
              zIndex={4999}
              bgcolor="rgba(0, 0, 0, 0.6)"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                padding: '8px',
                borderRadius: '10px',
              }}
            >
              <Typography
                variant="subtitle2"
                component="div"
                sx={{
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                Ready to save: click here
              </Typography>
              {downloadLoader && (
                <CircularProgress color="secondary" size={14} />
              )}
            </Box>
          )}
        </Widget>
      )}
    </Box>
  );
}
