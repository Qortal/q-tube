import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { fontSizeMedium } from '../../../constants/Misc.ts';

export const VideoContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
}));

export const VideoPlayerContainer = styled(Box)(({ theme }) => ({}));

export const VideoTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  wordBreak: 'break-word',

  userSelect: 'auto',
}));

export const Spacer = ({ height }: any) => {
  return (
    <Box
      sx={{
        height: height,
      }}
    />
  );
};

export const StyledCardHeaderComment = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '5px',
  padding: '7px 0px',
});

export const StyledCardColComment = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'row',
  gap: '2px',
  alignItems: 'flex-start',
});

export const AuthorTextComment = styled(Typography)({
  fontSize: fontSizeMedium,
  lineHeight: '1.2',
});
