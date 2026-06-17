import { Avatar, Box, SxProps, Theme, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AuthorTextComment,
  StyledCardHeaderComment,
} from './VideoContent-styles.tsx';

export interface ChannelParams {
  channelName: string;
  sx?: SxProps<Theme>;
}

export const ChannelName = ({ channelName }: ChannelParams) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <StyledCardHeaderComment
      sx={{
        '& .MuiCardHeader-content': {
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          minWidth: '125px',
        }}
        onClick={() => {
          navigate(`/channel/${encodeURIComponent(channelName)}/videos`);
        }}
      >
        <Avatar
          src={`/arbitrary/THUMBNAIL/${encodeURIComponent(channelName)}/qortal_avatar`}
          alt={`${channelName}'s avatar`}
        />
        <AuthorTextComment
          color={
            theme.palette.mode === 'light'
              ? theme.palette.text.secondary
              : '#d6e8ff'
          }
          sx={{
            cursor: 'pointer',
            display: 'inline',
            marginLeft: '10px',
          }}
        >
          {channelName}
        </AuthorTextComment>
      </Box>
    </StyledCardHeaderComment>
  );
};
