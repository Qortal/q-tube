import { Box, SxProps, Theme } from '@mui/material';
import { ChannelButtons } from './ChannelButtons.tsx';
import { ChannelName, ChannelParams } from './ChannelName.tsx';

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
