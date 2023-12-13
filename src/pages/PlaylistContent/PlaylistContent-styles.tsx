import { styled } from "@mui/system";
import { Box, Grid, Typography, Checkbox } from "@mui/material";

export const VideoPlayerContainer = styled(Box)(({ theme }) => ({
  maxWidth: '95%',
    width: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}));

export const VideoTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Raleway",
  fontSize: "20px",
  color: theme.palette.text.primary,
  userSelect: "none",
  wordBreak: "break-word"
}));

export const VideoDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "Raleway",
  fontSize: "16px",
  color: theme.palette.text.primary,
  userSelect: "none",
  wordBreak: "break-word"
}));

export const Spacer = ({height}: any)=> {
  return <Box sx={{
    height: height
  }} />
}

export const StyledCardHeaderComment = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '5px',
  padding: '7px 0px'
})
export const StyledCardCol = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%'
})

export const StyledCardColComment = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%'
})

export const AuthorTextComment = styled(Typography)({
  fontFamily: 'Raleway, sans-serif',
  fontSize: '16px',
  lineHeight: '1.2'
})

export const FileAttachmentContainer = styled(Box)(({ theme }) =>({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "5px 10px",
  border: `1px solid ${theme.palette.text.primary}`,
}));

export const FileAttachmentFont = styled(Typography)(({ theme }) => ({
  fontFamily: "Mulish",
  color: theme.palette.text.primary,
  fontSize: "16px",
  letterSpacing: 0,
  fontWeight: 400,
  userSelect: "none",
  whiteSpace: 'nowrap'
}));