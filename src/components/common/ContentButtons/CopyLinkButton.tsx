import ShareIcon from '@mui/icons-material/Share';
import { Box, ButtonBase } from '@mui/material';
import { useState } from 'react';
import { useSetAtom } from 'jotai';

import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { CustomTooltip } from './CustomTooltip.tsx';
import { CopyLinkModal } from './CopyLinkModal.tsx';

export interface CopyLinkButtonProps {
  link: string;
  tooltipTitle: string;
  videoData?: {
    title?: string;
    description?: string;
  };
}

export const CopyLinkButton = ({
  link,
  tooltipTitle,
  videoData,
}: CopyLinkButtonProps) => {
  const setNotification = useSetAtom(setNotificationAtom);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // If videoData provided, show popover. Otherwise, copy link directly.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (videoData) {
      setAnchorEl(event.currentTarget);
    } else {
      // Original behavior: copy link directly
      navigator.clipboard.writeText(link).then(() => {
        const notificationObj: AltertObject = {
          msg: 'Copied to clipboard!',
          alertType: 'success',
        };
        setNotification(notificationObj);
      });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CustomTooltip title={tooltipTitle} placement={'top'} arrow>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <ButtonBase onClick={handleClick}>
            <ShareIcon />
          </ButtonBase>
        </Box>
      </CustomTooltip>
      {videoData && (
        <CopyLinkModal
          anchorEl={anchorEl}
          onClose={handleClose}
          link={link}
          title={videoData.title}
          description={videoData.description}
        />
      )}
    </>
  );
};
