import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import { Movie } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DownloadingLight } from '../../assets/svgs/DownloadingLight';
import { DownloadedLight } from '../../assets/svgs/DownloadedLight';
import { useAllResourceStatus } from 'qapp-core';
import CheckIcon from '@mui/icons-material/Check';

export const DownloadTaskManager: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openDownload, setOpenDownload] = useState<boolean>(false);
  const allResourceStatus = useAllResourceStatus();

  const handleClick = (event?: React.MouseEvent<HTMLDivElement>) => {
    const target = event?.currentTarget as unknown as HTMLButtonElement | null;
    setAnchorEl(target);
  };

  const handleCloseDownload = () => {
    setAnchorEl(null);
    setOpenDownload(false);
  };

  if (!allResourceStatus || allResourceStatus?.length === 0) return null;

  let downloadInProgress = false;
  if (
    allResourceStatus.find(
      (dl) =>
        dl?.status?.status !== 'READY' && dl?.status?.status !== 'DOWNLOADED'
    )
  ) {
    downloadInProgress = true;
  }

  return (
    <Box>
      <Button
        sx={{ padding: '0px 0px', minWidth: '0px' }}
        onClick={(e: any) => {
          handleClick(e);
          setOpenDownload(true);
        }}
      >
        {downloadInProgress ? (
          <DownloadingLight
            height="35px"
            width="35px"
            className="download-icon"
          />
        ) : (
          <DownloadedLight height="35px" width="35px" />
        )}
      </Button>

      <Popover
        id={'download-popover'}
        open={openDownload}
        anchorEl={anchorEl}
        onClose={handleCloseDownload}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ marginTop: '12px' }}
      >
        <List
          sx={{
            maxHeight: '50vh',
            overflow: 'auto',
            width: '100%',
            maxWidth: '400px',
            gap: '5px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#555555',
          }}
        >
          {allResourceStatus
            ?.filter((dl) => dl?.filename && dl?.path)
            ?.map((download: any) => {
              const progress = download?.status?.percentLoaded;
              const status = download?.status?.status;

              return (
                <ListItem
                  key={download?.metadata?.identifier}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '2px',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => {
                    navigate(download?.path);
                    handleCloseDownload();
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ListItemIcon>
                      <Movie sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>

                    <Box sx={{ width: '100px', marginLeft: 1, marginRight: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          borderRadius: '5px',
                          color: theme.palette.secondary.main,
                        }}
                      />
                    </Box>
                    {status === 'READY' ? (
                      <CheckIcon />
                    ) : (
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                        }}
                        variant="caption"
                      >
                        {`${progress?.toFixed(1)}%`}{' '}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '10px',
                      width: '100%',
                      textAlign: 'start',
                      color: theme.palette.text.primary,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {download?.filename}
                  </Typography>
                  <Divider flexItem />
                </ListItem>
              );
            })}
        </List>
      </Popover>
    </Box>
  );
};
