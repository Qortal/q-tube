import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const VideoPlayerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

export const VideoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}));

const VideoDescription = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
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

const StyledCardHeaderComment = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '5px',
  padding: '7px 0px',
});
const StyledCardCol = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%',
});

const StyledCardColComment = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%',
});

const AuthorTextComment = styled(Typography)({
  fontSize: '20px',
  lineHeight: '1.2',
});

const FileAttachmentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '5px 10px',
  border: `1px solid ${theme.palette.text.primary}`,
  width: '350px',
}));
