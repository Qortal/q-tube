import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { CommentEditor } from './CommentEditor';
import {
  CardContentContainerComment,
  CommentActionButtonRow,
  CommentDateText,
  CreatedTextComment,
  EditReplyButton,
  StyledCardComment,
} from './Comments-styles';
import { StyledCardHeaderComment } from './Comments-styles';
import { StyledCardColComment } from './Comments-styles';
import { AuthorTextComment } from './Comments-styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  StyledCardContentComment,
  LoadMoreCommentsButton as CommentActionButton,
} from './Comments-styles';

import Portal from '../Portal';
import { formatDate } from '../../../utils/time';
import { createAvatarLink, Spacer, useAuth } from 'qapp-core';
import { useIsSmall } from '../../../hooks/useIsSmall';
interface CommentProps {
  comment: any;
  postId: string;
  postName: string;
  onSubmit: (obj?: any, isEdit?: boolean) => void;
}
export const Comment = ({
  comment,
  postId,
  postName,
  onSubmit,
}: CommentProps) => {
  const isSmall = useIsSmall();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { name } = useAuth();
  const [currentEdit, setCurrentEdit] = useState<any>(null);
  const theme = useTheme();
  const [isOpenReplies, setIsOpenReplies] = useState(false);
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
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => setCurrentEdit(null)}>
                Close
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
        created={comment?.created}
        isOpenReplies={isOpenReplies}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {isReplying && (
            <CommentEditor
              onSubmit={handleSubmit}
              postId={postId}
              postName={postName}
              isReply
              commentId={comment.identifier}
              onCloseReply={() => {
                setIsReplying(false);
                setIsEditing(false);
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '20px',
            justifyContent: 'space-between',
          }}
        >
          <CommentActionButtonRow
            sx={{
              gap: '20px',
            }}
          >
            {!isReplying && (
              <ButtonBase onClick={() => setIsReplying(true)}>
                <Typography>Reply</Typography>
              </ButtonBase>
            )}

            {/* {name === comment?.name && (
              <ButtonBase onClick={() => setCurrentEdit(comment)}>
                <Typography>Edit</Typography>
              </ButtonBase>
            )} */}
            {/* {isReplying && (
              <CommentActionButton
                size="small"
                variant="contained"
                onClick={() => {
                  setIsReplying(false);
                  setIsEditing(false);
                }}
              >
                close
              </CommentActionButton>
            )} */}
            {comment?.replies && comment?.replies?.length > 0 && (
              <ButtonBase onClick={() => setIsOpenReplies((prev) => !prev)}>
                {isOpenReplies ? (
                  <ExpandLessIcon
                    sx={{
                      color: 'primary.dark',
                    }}
                  />
                ) : (
                  <ExpandMoreIcon
                    sx={{
                      color: 'primary.dark',
                    }}
                  />
                )}

                <Typography
                  color="primary.dark"
                  sx={{
                    fontSize: isSmall ? '14px' : 'unset',
                  }}
                >
                  {isOpenReplies
                    ? ` Hide all replies (${comment?.replies?.length})`
                    : ` View all replies (${comment?.replies?.length})`}
                </Typography>
              </ButtonBase>
            )}
          </CommentActionButtonRow>
        </Box>
      </CommentCard>
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
  isOpenReplies,
  isReply,
}: any) => {
  const isSmall = useIsSmall();
  const { name: username } = useAuth();
  const avatarUrl = createAvatarLink(name);

  return (
    <CardContentContainerComment>
      <StyledCardHeaderComment
        sx={{
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      >
        <Box>
          <Avatar
            src={avatarUrl}
            alt={`${name}'s avatar`}
            sx={{
              width: isReply && !isSmall ? '30px' : '40px',
              height: isReply && !isSmall ? '30px' : '40px',
              marginRight: '5px',
            }}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <StyledCardColComment
            sx={{
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            <AuthorTextComment>{name}</AuthorTextComment>
            <CreatedTextComment>{formatDate(+created)}</CreatedTextComment>
          </StyledCardColComment>
          <Spacer height="10px" />
          <StyledCardContentComment>
            <StyledCardComment>{message}</StyledCardComment>
          </StyledCardContentComment>
          {children}
        </Box>
      </StyledCardHeaderComment>
      <Collapse in={isOpenReplies} timeout="auto" unmountOnExit>
        <Box
          sx={{
            paddingLeft: isSmall ? '2px' : '50px',
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            border: isSmall ? '1px solid grey' : 'unset',
            paddingRight: isSmall ? '2px' : 'unset',
          }}
        >
          {replies?.map((reply: any) => {
            return (
              <Box
                key={reply?.identifier}
                id={reply?.identifier}
                sx={{
                  display: 'flex',
                  borderRadius: '10px',
                  marginTop: '8px',
                  width: '100%',
                }}
              >
                <CommentCard
                  name={reply?.name}
                  message={reply?.message}
                  setCurrentEdit={setCurrentEdit}
                  created={reply?.created}
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
                    {/* {username === reply?.name ? (
                      <EditReplyButton
                        size="small"
                        variant="contained"
                        onClick={() => setCurrentEdit(reply)}
                        sx={{}}
                      >
                        edit
                      </EditReplyButton>
                    ) : (
                      <Box />
                    )} */}
                  </Box>
                </CommentCard>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </CardContentContainerComment>
  );
};
