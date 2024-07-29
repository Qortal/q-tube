import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import { Box, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../../state/features/notificationsSlice.ts";
import ShortUniqueId from "short-unique-id";
import { objectToBase64 } from "../../../utils/PublishFormatter.ts";
import { RootState } from "../../../state/store.ts";
import { FOR, FOR_LIKE, LIKE_BASE } from "../../../constants/Identifiers.ts";
import {
  formatLikeCount,
  getCurrentLikesAndDislikesCount,
  getCurrentLikeType,
  LikesAndDislikes,
} from "./LikeAndDislike-functions.ts";

interface LikeAndDislikeProps {
  name: string;
  identifier: string;
}
export enum LikeType {
  Like = 1,
  Neutral = 0,
  Dislike = -1,
}
export const LIKE = LikeType.Like;
export const DISLIKE = LikeType.Dislike;
export const NEUTRAL = LikeType.Neutral;
export const LikeAndDislike = ({ name, identifier }: LikeAndDislikeProps) => {
  const username = useSelector((state: RootState) => state.auth?.user?.name);
  const dispatch = useDispatch();
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [currentLikeType, setCurrentLikeType] = useState<LikeType>(NEUTRAL);
  const likeIdentifier = `${LIKE_BASE}${identifier.slice(0, 39)}`;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    type PromiseReturn = [LikeType, LikesAndDislikes];

    Promise.all([
      getCurrentLikeType(username, likeIdentifier),
      getCurrentLikesAndDislikesCount(likeIdentifier),
    ]).then(([likeType, likesAndDislikes]: PromiseReturn) => {
      setCurrentLikeType(likeType);

      setLikeCount(likesAndDislikes?.likes || 0);
      setDislikeCount(likesAndDislikes?.dislikes || 0);
      setIsLoading(false);
    });
  }, []);

  const updateLikeDataState = (newLikeType: LikeType) => {
    const setSuccessNotification = (msg: string) =>
      dispatch(
        setNotification({
          msg,
          alertType: "success",
        })
      );
    setCurrentLikeType(newLikeType);
    switch (newLikeType) {
      case NEUTRAL:
        if (currentLikeType === LIKE) {
          setLikeCount(count => count - 1);
          setSuccessNotification("Like Removed");
        } else {
          setDislikeCount(count => count - 1);
          setSuccessNotification("Dislike Removed");
        }

        break;
      case LIKE:
        if (currentLikeType === DISLIKE) setDislikeCount(count => count - 1);
        setLikeCount(count => count + 1);
        setSuccessNotification("Like Successful");
        break;
      case DISLIKE:
        if (currentLikeType === LIKE) setLikeCount(count => count - 1);
        setDislikeCount(count => count + 1);
        setSuccessNotification("Dislike Successful");
        break;
    }
  };
  const publishLike = async (chosenLikeType: LikeType) => {
    if (isLoading) {
      dispatch(
        setNotification({
          msg: "Wait for Like Data to load first",
          alertType: "error",
        })
      );
      return;
    }
    try {
      if (!username) throw new Error("You need a name to publish");
      if (!name) throw new Error("Could not retrieve content creator's name");
      if (!identifier) throw new Error("Could not retrieve id of video post");

      if (username === name) {
        dispatch(
          setNotification({
            msg: "You cannot send yourself a like",
            alertType: "error",
          })
        );
        return;
      }
      qortalRequest({
        action: "GET_NAME_DATA",
        name: name,
      }).then(resName => {
        const address = resName.owner;
        if (!address)
          throw new Error("Could not retrieve content creator's address");
      });

      await qortalRequest({
        action: "PUBLISH_QDN_RESOURCE",
        name: username,
        service: "CHAIN_COMMENT",
        data64: await objectToBase64({ likeType: chosenLikeType }),
        title: "",
        identifier: likeIdentifier,
        filename: `like_metadata.json`,
      });

      updateLikeDataState(chosenLikeType);
    } catch (error: any) {
      dispatch(
        setNotification({
          msg:
            error ||
            error?.error ||
            error?.message ||
            "Failed to publish Like or Dislike",
          alertType: "error",
        })
      );
      throw new Error("Failed to publish Super Like");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Tooltip title="Like or Dislike Video" placement="top">
          <Box
            sx={{
              padding: "5px",
              borderRadius: "7px",
              gap: "5px",
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              height: "53px",
            }}
          >
            {currentLikeType === LIKE ? (
              <ThumbUpIcon onClick={() => publishLike(NEUTRAL)} />
            ) : (
              <ThumbUpOffAltOutlinedIcon onClick={() => publishLike(LIKE)} />
            )}
            {likeCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                <span style={{ marginRight: "10px", paddingBottom: "4px" }}>
                  {formatLikeCount(likeCount)}
                </span>
              </div>
            )}

            {currentLikeType === DISLIKE ? (
              <ThumbDownIcon
                onClick={() => publishLike(NEUTRAL)}
                color={"error"}
              />
            ) : (
              <ThumbDownOffAltOutlinedIcon
                onClick={() => publishLike(DISLIKE)}
                color={"error"}
              />
            )}
            {dislikeCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    paddingBottom: "4px",
                    color: "red",
                  }}
                >
                  {formatLikeCount(dislikeCount)}
                </span>
              </div>
            )}
          </Box>
        </Tooltip>
      </Box>
    </>
  );
};
