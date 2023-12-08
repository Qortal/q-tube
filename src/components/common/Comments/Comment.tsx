import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import { CommentEditor } from "./CommentEditor";
import {
  CardContentContainerComment,
  CommentActionButtonRow,
  CommentDateText,
  EditReplyButton,
  StyledCardComment,
} from "./Comments-styles";
import { StyledCardHeaderComment } from "./Comments-styles";
import { StyledCardColComment } from "./Comments-styles";
import { AuthorTextComment } from "./Comments-styles";
import {
  StyledCardContentComment,
  LoadMoreCommentsButton as CommentActionButton,
} from "./Comments-styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import Portal from "../Portal";
import { formatDate } from "../../../utils/time";
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
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
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
        display: "flex",
        width: "100%",
        flexDirection: "column",
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
                  width: "300px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CommentEditor
                  onSubmit={obj => handleSubmit(obj, true)}
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
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          {comment?.created && (
            <Typography
              variant="h6"
              sx={{
                fontSize: "12px",
                marginLeft: "5px",
              }}
              color={theme.palette.text.primary}
            >
              {formatDate(+comment?.created)}
            </Typography>
          )}
          <CommentActionButtonRow>
            <CommentActionButton
              size="small"
              variant="contained"
              onClick={() => setIsReplying(true)}
            >
              reply
            </CommentActionButton>
            {user?.name === comment?.name && (
              <CommentActionButton
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
                variant="contained"
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
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
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

const CommentCard = ({
  message,
  created,
  name,
  replies,
  children,
  setCurrentEdit,
}: any) => {
  const [avatarUrl, setAvatarUrl] = React.useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);

  const theme = useTheme();

  const getAvatar = React.useCallback(async (author: string) => {
    try {
      const url = await qortalRequest({
        action: "GET_QDN_RESOURCE_URL",
        name: author,
        service: "THUMBNAIL",
        identifier: "qortal_avatar",
      });

      setAvatarUrl(url);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAvatar(name);
  }, [name]);

  return (
    <CardContentContainerComment>
      <StyledCardHeaderComment
        sx={{
          "& .MuiCardHeader-content": {
            overflow: "hidden",
          },
        }}
      >
        <Box>
          <Avatar
            src={avatarUrl}
            alt={`${name}'s avatar`}
            sx={{ width: "35px", height: "35px" }}
          />
        </Box>
        <StyledCardColComment>
          <AuthorTextComment>{name}</AuthorTextComment>
        </StyledCardColComment>
      </StyledCardHeaderComment>
      <StyledCardContentComment>
        <StyledCardComment>{message}</StyledCardComment>
      </StyledCardContentComment>
      <Box
        sx={{
          paddingLeft: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {replies?.map((reply: any) => {
          return (
            <Box
              key={reply?.identifier}
              id={reply?.identifier}
              sx={{
                display: "flex",
                border: "1px solid grey",
                borderRadius: "10px",
                marginTop: "8px",
              }}
            >
              <CommentCard
                name={reply?.name}
                message={reply?.message}
                setCurrentEdit={setCurrentEdit}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "space-between",
                  }}
                >
                  {reply?.created && (
                    <CommentDateText>
                      {formatDate(+reply?.created)}
                    </CommentDateText>
                  )}
                  {user?.name === reply?.name ? (
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
