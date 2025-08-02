import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  fontSizeSmall,
  smallScreenSizeString,
} from '../../../constants/Misc.ts';

import { CommentEditor } from './CommentEditor';
import {
  CardContentContainerComment,
  CommentActionButtonRow,
  CommentDateText,
  EditReplyButton,
  StyledCardComment,
} from './Comments-styles';
import { StyledCardHeaderComment } from './Comments-styles';
import { StyledCardColComment } from './Comments-styles';
import { AuthorTextComment } from './Comments-styles';
import {
  StyledCardContentComment,
  LoadMoreCommentsButton as CommentActionButton,
} from './Comments-styles';

import Portal from '../Portal';
import { formatDate } from '../../../utils/time';
import { createAvatarLink, useAuth } from 'qapp-core';
import { useTranslation } from 'react-i18next';
interface CommentProps {
  comment: any;
  postId: string;
  postName: string;
  onSubmit: (obj?: any, isEdit?: boolean) => void;
  amount?: null | number;
  isSuperLike?: boolean;
  hasHash?: boolean;
}
export const Comment = ({
  comment,
  postId,
  postName,
  onSubmit,
  amount,
  isSuperLike,
  hasHash,
}: CommentProps) => {
  const { t, i18n } = useTranslation(['core']);

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { name: username } = useAuth();
  const [currentEdit, setCurrentEdit] = useState<any>(null);
  const theme = useTheme();

  const handleSubmit = useCallback((comment: any, isEdit?: boolean) => {
    onSubmit(comment, isEdit);
    setCurrentEdit(null);
    setIsReplying(false);
  }, []);

  return (
    <Box
      id={comment?.identifier}
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      {currentEdit && (
        <Portal>
          <Dialog
            open={!!currentEdit}
            onClose={() => setCurrentEdit(null)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  width: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CommentEditor
                  onSubmit={(obj) => handleSubmit(obj, true)}
                  postId={postId}
                  postName={postName}
                  isEdit
                  commentId={currentEdit?.identifier}
                  commentMessage={currentEdit?.message}
                  isSuperLike={!!currentEdit?.transactionReference}
                  comment={comment}
                  hasHash={hasHash}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => setCurrentEdit(null)}>
                {t('core:action.close', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Button>
            </DialogActions>
          </Dialog>
        </Portal>
      )}
      <CommentCard
        name={comment?.name}
        message={comment?.message}
        replies={comment?.replies || []}
        setCurrentEdit={setCurrentEdit}
        amount={amount}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '20px',
            justifyContent: 'space-between',
          }}
        >
          {comment?.created && (
            <Typography
              variant="h6"
              sx={{
                fontSize: '12px',
                marginLeft: '5px',
              }}
              color={theme.palette.text.primary}
            >
              {formatDate(+comment?.created, i18n.language)}
            </Typography>
          )}
          <CommentActionButtonRow>
            {!isReplying && (
              <CommentActionButton
                size="small"
                variant="contained"
                onClick={() => setIsReplying(true)}
              >
                {t('core:action.reply', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </CommentActionButton>
            )}

            {username === comment?.name && hasHash && (
              <CommentActionButton
                color="info"
                size="small"
                variant="contained"
                onClick={() => setCurrentEdit(comment)}
              >
                edit
              </CommentActionButton>
            )}
            {isReplying && (
              <CommentActionButton
                size="small"
                variant="text"
                color="info"
                onClick={() => {
                  setIsReplying(false);
                  setIsEditing(false);
                }}
              >
                close
              </CommentActionButton>
            )}
          </CommentActionButtonRow>
        </Box>
      </CommentCard>

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {isReplying && (
          <CommentEditor
            onSubmit={handleSubmit}
            postId={postId}
            postName={postName}
            isReply
            commentId={comment.identifier}
          />
        )}
      </Box>
    </Box>
  );
};

export const CommentCard = ({
  message,
  created,
  name,
  replies,
  children,
  setCurrentEdit,
  isReply,
  amount,
}: any) => {
  const { t, i18n } = useTranslation(['core']);

  const [avatarUrl, setAvatarUrl] = React.useState<string>('');

  const { name: username } = useAuth();
  const getAvatar = React.useCallback(async (author: string) => {
    try {
      const url = createAvatarLink(author);

      setAvatarUrl(url);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAvatar(name);
  }, [name]);

  const isScreenSmall = !useMediaQuery(`(min-width:${smallScreenSizeString})`);
  const superLikeHeaderSX = {
    display: 'flex',
    flexDirection: isScreenSmall ? 'column' : 'row',
    alignItems: 'center',
  };

  return (
    <CardContentContainerComment>
      <StyledCardHeaderComment
        sx={{
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={superLikeHeaderSX}>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={avatarUrl}
              alt={`${name}'s avatar`}
              sx={{ width: '35px', height: '35px' }}
            />
            <AuthorTextComment sx={{ width: 'max-content' }}>
              {name}
            </AuthorTextComment>
          </Box>
          <StyledCardColComment
            sx={{
              marginTop: isScreenSmall ? '10px' : '0px',
              marginLeft: isScreenSmall ? '0px' : '10px',
            }}
          >
            {!isReply && (
              <ThumbUpIcon
                style={{
                  color: 'gold',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              />
            )}
            {amount && (
              <Typography
                sx={{
                  fontSize: fontSizeSmall,
                  color: 'gold',
                }}
              >
                {parseFloat(amount)?.toFixed(2)} QORT
              </Typography>
            )}
          </StyledCardColComment>
        </Box>
      </StyledCardHeaderComment>
      <StyledCardContentComment>
        <StyledCardComment>{message}</StyledCardComment>
      </StyledCardContentComment>
      <Box
        sx={{
          paddingLeft: '15px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {replies?.map((reply: any) => {
          return (
            <Box
              key={reply?.identifier}
              id={reply?.identifier}
              sx={{
                display: 'flex',
                border: '1px solid grey',
                borderRadius: '10px',
                marginTop: '8px',
              }}
            >
              <CommentCard
                name={reply?.name}
                message={reply?.message}
                setCurrentEdit={setCurrentEdit}
                isReply
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    justifyContent: 'space-between',
                  }}
                >
                  {reply?.created && (
                    <CommentDateText>
                      {formatDate(+reply?.created, i18n.language)}
                    </CommentDateText>
                  )}
                  {username === reply?.name ? (
                    <EditReplyButton
                      size="small"
                      color="info"
                      variant="contained"
                      onClick={() => setCurrentEdit(reply)}
                      sx={{}}
                    >
                      {t('core:action.edit', {
                        postProcess: 'capitalizeFirstChar',
                      })}
                    </EditReplyButton>
                  ) : (
                    <Box />
                  )}
                </Box>
              </CommentCard>
            </Box>
          );
        })}
      </Box>
      {children}
    </CardContentContainerComment>
  );
};
