import { styled } from '@mui/system';
import { Box, Grid, Typography, Checkbox } from '@mui/material';
import { fontSizeMedium, fontSizeSmall } from '../../../constants/Misc.ts';

export const VideoContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
}));

export const VideoPlayerContainer = styled(Box)(({ theme }) => ({}));

export const VideoTitle = styled(Typography)(({ theme }) => ({
  fontSize: fontSizeMedium,
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}));

export const VideoDescription = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
  userSelect: 'none',
  wordBreak: 'break-word',
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
export const StyledCardCol = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%',
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

export const FileAttachmentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '5px 10px',
  border: `1px solid ${theme.palette.text.primary}`,
  height: '50px',
}));

export const FileAttachmentFont = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '20px',
  letterSpacing: 0,
  fontWeight: 400,
  userSelect: 'none',
  whiteSpace: 'nowrap',
}));
