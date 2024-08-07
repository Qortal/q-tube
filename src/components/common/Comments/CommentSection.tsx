import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommentEditor } from "./CommentEditor";
import { Comment } from "./Comment";
import { Box, Button, CircularProgress, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CommentContainer,
  CommentEditorContainer,
  CommentsContainer,
  LoadMoreCommentsButton,
  LoadMoreCommentsButtonRow,
  NoCommentsRow,
} from "./Comments-styles";
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from "../../Publish/PublishVideo/PublishVideo-styles.tsx";
import { COMMENT_BASE } from "../../../constants/Identifiers.ts";

interface CommentSectionProps {
  postId: string;
  postName: string;
}

const Panel = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  width: 100%;
  padding-bottom: 10px;
  height: 100%;
  overflow: hidden;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;
export const CommentSection = ({ postId, postName }: CommentSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listComments, setListComments] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [newMessages, setNewMessages] = useState(0);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  // console.log("postId is: ", postId, " postName is: ", postName);
  const onSubmit = (obj?: any, isEdit?: boolean) => {
    if (isEdit) {
      setListComments((prev: any[]) => {
        const findCommentIndex = prev.findIndex(
          item => item?.identifier === obj?.identifier
        );
        if (findCommentIndex === -1) return prev;

        const newArray = [...prev];
        newArray[findCommentIndex] = obj;
        return newArray;
      });

      return;
    }
    setListComments(prev => [
      ...prev,
      {
        ...obj,
      },
    ]);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    let commentVar = query?.get("comment");
    if (commentVar) {
      if (commentVar && commentVar.endsWith("/")) {
        commentVar = commentVar.slice(0, -1);
      }
      setIsOpen(true);
      if (listComments.length > 0) {
        const el = document.getElementById(commentVar);
        if (el) {
          el.scrollIntoView();
          el.classList.add("glow");
          setTimeout(() => {
            el.classList.remove("glow");
          }, 2000);
        }
        navigate(location.pathname, { replace: true });
      }
    }
  }, [navigate, location, listComments]);

  const getReplies = useCallback(
    async (commentId, postId) => {
      const offset = 0;

      const removeBaseCommentId = commentId.replace("_base_", "");
      const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&query=${COMMENT_BASE}${postId.slice(
        -12
      )}_reply_${removeBaseCommentId.slice(
        -6
      )}&limit=0&includemetadata=false&offset=${offset}&reverse=false&excludeblocked=true`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      const comments: any[] = [];
      for (const comment of responseData) {
        if (comment.identifier && comment.name) {
          const url = `/arbitrary/BLOG_COMMENT/${comment.name}/${comment.identifier}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const responseData2 = await response.text();
          if (responseData) {
            comments.push({
              message: responseData2,
              ...comment,
            });
          }
        }
      }
      return comments;
    },
    [postId]
  );

  const getComments = useCallback(
    async (isNewMessages?: boolean, numberOfComments?: number) => {
      try {
        setLoadingComments(true);
        let offset = 0;
        if (isNewMessages && numberOfComments) {
          offset = numberOfComments;
        }
        const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&query=${COMMENT_BASE}${postId.slice(
          -12
        )}_base_&limit=20&includemetadata=false&offset=${offset}&reverse=false&excludeblocked=true`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        // console.log("url is: ", url);
        // console.log("response is: ", responseData);

        let comments: any[] = [];
        for (const comment of responseData) {
          if (comment.identifier && comment.name) {
            const url = `/arbitrary/BLOG_COMMENT/${comment.name}/${comment.identifier}`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const responseData2 = await response.text();
            if (responseData) {
              comments.push({
                message: responseData2,
                ...comment,
              });
            }
            const res = await getReplies(comment.identifier, postId);
            comments = [...comments, ...res];
          }
        }
        if (isNewMessages) {
          setListComments(prev => [...prev, ...comments]);
          setNewMessages(0);
        } else {
          setListComments(comments);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingComments(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    getComments();
  }, [getComments, postId]);

  const structuredCommentList = useMemo(() => {
    return listComments.reduce((acc, curr, index, array) => {
      if (curr?.identifier?.includes("_reply_")) {
        return acc;
      }
      acc.push({
        ...curr,
        replies: array.filter(comment =>
          comment.identifier.includes(`_reply_${curr.identifier.slice(-6)}`)
        ),
      });
      return acc;
    }, []);
  }, [listComments]);

  return (
    <>
      <Panel>
        <CommentsContainer>
          {loadingComments ? (
            <NoCommentsRow>
              <CircularProgress />
            </NoCommentsRow>
          ) : listComments.length === 0 ? (
            <></>
          ) : (
            <CommentContainer>
              {structuredCommentList.map((comment: any) => {
                return (
                  <Comment
                    key={comment?.identifier}
                    comment={comment}
                    onSubmit={onSubmit}
                    postId={postId}
                    postName={postName}
                  />
                );
              })}
            </CommentContainer>
          )}
          {listComments.length > 20 && (
            <LoadMoreCommentsButtonRow>
              <LoadMoreCommentsButton
                onClick={() => {
                  getComments(
                    true,
                    listComments.filter(
                      item => !item.identifier.includes("_reply_")
                    ).length
                  );
                }}
                variant="contained"
                size="small"
              >
                Load More Comments
              </LoadMoreCommentsButton>
            </LoadMoreCommentsButtonRow>
          )}
        </CommentsContainer>
        <CommentEditorContainer>
          <CommentEditor
            onSubmit={onSubmit}
            postId={postId}
            postName={postName}
          />
        </CommentEditorContainer>
      </Panel>
    </>
  );
};
