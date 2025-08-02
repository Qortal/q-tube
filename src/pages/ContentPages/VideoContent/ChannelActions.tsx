import { Box, SxProps, Theme, useMediaQuery } from '@mui/material';
import { smallScreenSizeString } from '../../../constants/Misc.ts';
import { ChannelButtons } from './ChannelButtons.tsx';
import { ChannelName, ChannelParams } from './ChannelName.tsx';
import { Spacer } from './VideoContent-styles.tsx';

export const ChannelActions = ({ channelName, sx }: ChannelParams) => {
  const boxSX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: '10px',
    columnGap: '20px',
  };

  return (
    <Box sx={{ ...boxSX, ...sx }}>
      <ChannelName channelName={channelName} />
      <ChannelButtons
        channelName={channelName}
        sx={{
          gap: '16px',
        }}
      />
    </Box>
  );
};
