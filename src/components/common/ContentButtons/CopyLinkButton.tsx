import ShareIcon from '@mui/icons-material/Share';
import { Box, ButtonBase } from '@mui/material';
import { CustomTooltip } from './CustomTooltip.tsx';

import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { useSetAtom } from 'jotai';

export interface CopyLinkButtonProps {
  link: string;
  tooltipTitle: string;
}
export const CopyLinkButton = ({ link, tooltipTitle }: CopyLinkButtonProps) => {
  const setNotification = useSetAtom(setNotificationAtom);

  return (
    <CustomTooltip title={tooltipTitle} placement={'top'} arrow>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
        }}
      >
        <ButtonBase
          onClick={() => {
            navigator.clipboard.writeText(link).then(() => {
              const notificationObj: AltertObject = {
                msg: 'Copied to clipboard!',
                alertType: 'success',
              };
              setNotification(notificationObj);
            });
          }}
        >
          <ShareIcon />
        </ButtonBase>
      </Box>
    </CustomTooltip>
  );
};
