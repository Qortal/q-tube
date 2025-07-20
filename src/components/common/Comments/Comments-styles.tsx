import { styled } from '@mui/system';
import { Card, Box, Typography, Button, TextField } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary.dark,
  maxWidth: '600px',
  width: '100%',
  margin: '10px 0px',
  cursor: 'pointer',
  '@media (max-width: 450px)': {
    width: '100%;',
  },
}));

export const CardContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.primary.dark
      : theme.palette.primary.light,
  margin: '5px 10px',
  borderRadius: '15px',
}));

export const CardContentContainerComment = styled(Box)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'light' ? '#a9d9d038' : '#c3abe414',
  // border: `1px solid ${theme.palette.primary.main}`,
  margin: '0px',
  // padding: '8px 15px',
  borderRadius: '8px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '5px',
  padding: '7px',
});

export const StyledCardHeaderComment = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '7px',
  padding: '0px 7px 9px 0px',
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
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  width: '100%',
});

export const StyledCardContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '5px 10px',
  gap: '10px',
});

export const StyledCardContentComment = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  // padding: '5px 10px',
  gap: '10px',
});

export const StyledCardComment = styled(Typography)(({ theme }) => ({
  letterSpacing: 0,
  fontWeight: 300,
  color: theme.palette.text.primary,
  fontSize: '19px',
  wordBreak: 'break-word',
}));

export const TitleText = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  fontSize: '22px',
  lineHeight: '1.2',
});

export const AuthorText = styled(Typography)({
  fontSize: '16px',
  lineHeight: '1.2',
});

export const AuthorTextComment = styled(Typography)(({ theme }) => ({
  fontSize: '17px',
  letterSpacing: '0.3px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  userSelect: 'none',
}));
export const CreatedTextComment = styled(Typography)(({ theme }) => ({
  fontSize: '17px',
  letterSpacing: '0.3px',
  fontWeight: 300,
  color: theme.palette.text.primary,
  userSelect: 'none',
}));

export const IconsBox = styled(Box)({
  display: 'flex',
  gap: '3px',
  position: 'absolute',
  top: '12px',
  right: '5px',
  transition: 'all 0.3s ease-in-out',
});

export const BookmarkIconContainer = styled(Box)({
  display: 'flex',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
  backgroundColor: '#fbfbfb',
  color: '#50e3c2',
  padding: '5px',
  borderRadius: '3px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.1)',
  },
});

export const BlockIconContainer = styled(Box)({
  display: 'flex',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
  backgroundColor: '#fbfbfb',
  color: '#c25252',
  padding: '5px',
  borderRadius: '3px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.1)',
  },
});

export const CommentsContainer = styled(Box)({
  width: '100%',
  maxWidth: '1000px',
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  overflow: 'auto',
});

export const CommentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  margin: '10px 0px 50px 0px',
  maxWidth: '100%',
  width: '100%',
  gap: '10px',
  padding: '0px 5px',
});

export const NoCommentsRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  flex: '1',
  padding: '10px 0px',
  letterSpacing: 0,
  fontWeight: 400,
  fontSize: '18px',
});

export const LoadMoreCommentsButtonRow = styled(Box)({
  display: 'flex',
});

export const EditReplyButton = styled(Button)(({ theme }) => ({
  width: '30px',
  alignSelf: 'flex-end',
  background: theme.palette.primary.light,
  color: '#ffffff',
}));

export const LoadMoreCommentsButton = styled(Button)(({ theme }) => ({
  fontWeight: 400,
  letterSpacing: '0.2px',
  fontSize: '15px',
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
}));

export const CommentActionButtonRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
});

export const CommentEditorContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
});

export const CommentDateText = styled(Typography)(({ theme }) => ({
  letterSpacing: 0,
  fontWeight: 400,
  fontSize: '13px',
  marginLeft: '5px',
  color: theme.palette.text.primary,
}));

export const CommentInputContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '15px',
  width: '90%',
  maxWidth: '1000px',
  borderRadius: '8px',
  gap: '10px',
  alignItems: 'flex-start',
});

export const CommentInput = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#a9d9d01d' : '#c3abe4a',
  border: `1px solid ${theme.palette.primary.main}`,
  width: '100%',
  borderRadius: '8px',
  '& [class$="-MuiFilledInput-root"]': {
    letterSpacing: 0,
    fontWeight: 400,
    color: theme.palette.text.primary,
    fontSize: '19px',
    minHeight: '100px',
    backgroundColor: 'transparent',
    '&:before': {
      borderBottom: 'none',
      '&:hover': {
        borderBottom: 'none',
      },
    },
    '&:hover': {
      backgroundColor: 'transparent',
      '&:before': {
        borderBottom: 'none',
      },
    },
  },
}));

export const SubmitCommentButton = styled(Button)(({ theme }) => ({
  fontWeight: 400,
  letterSpacing: '0.2px',
  fontSize: '15px',
  color: theme.palette.primary.contrastText,
  minWidth: 100,
}));
