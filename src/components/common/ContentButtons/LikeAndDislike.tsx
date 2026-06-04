import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import { Box } from '@mui/material';
import { useSetAtom } from 'jotai';
import { hashWordWithoutPublicSalt, useAuth } from 'qapp-core';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LIKE_BASE,
  trigger_like_identifier,
} from '../../../constants/Identifiers.ts';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import { CustomTooltip } from './CustomTooltip.tsx';
import {
  formatLikeCount,
  getCurrentLikesAndDislikesCount,
  getCurrentLikeType,
  LikesAndDislikes,
} from './LikeAndDislike-functions.ts';
import {
  DISLIKE,
  LIKE,
  type LikeType,
  NEUTRAL,
} from './LikeAndDislike-types.ts';

interface LikeAndDislikeProps {
  name: string;
  identifier: string;
  created: number;
}
export const LikeAndDislike = ({
  name,
  identifier,
  created,
}: LikeAndDislikeProps) => {
  const [likeIdentifier, setLikeIdentifier] = useState<null | string>(null);
  const { t } = useTranslation(['core']);

  const { name: username } = useAuth();
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [currentLikeType, setCurrentLikeType] = useState<LikeType>(NEUTRAL);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setNotification = useSetAtom(setNotificationAtom);

  const createLikeIdentifier = useCallback(async (i, n, c) => {
    try {
      if (c < trigger_like_identifier) {
        setLikeIdentifier(`${LIKE_BASE}${identifier.slice(0, 39)}`);
        return;
      } else {
        const createdLikeIdentifier = await hashWordWithoutPublicSalt(
          i + n,
          20
        );
        setLikeIdentifier(createdLikeIdentifier);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (identifier && name && created) {
      createLikeIdentifier(identifier, name, created);
    }
  }, [identifier, name, created]);

  useEffect(() => {
    if (!username || !likeIdentifier) return;
    type PromiseReturn = [LikeType, LikesAndDislikes | undefined];

    Promise.all([
      getCurrentLikeType(username, likeIdentifier),
      getCurrentLikesAndDislikesCount(likeIdentifier),
    ]).then(([likeType, likesAndDislikes]: PromiseReturn) => {
      setCurrentLikeType(likeType);

      setLikeCount(likesAndDislikes?.likes || 0);
      setDislikeCount(likesAndDislikes?.dislikes || 0);
      setIsLoading(false);
    });
  }, [username, likeIdentifier]);

  const updateLikeDataState = (newLikeType: LikeType) => {
    const setSuccessNotification = (msg: string) => {
      const notificationObj: AltertObject = {
        msg,
        alertType: 'success',
      };
      setNotification(notificationObj);
    };
    setCurrentLikeType(newLikeType);
    switch (newLikeType) {
      case NEUTRAL:
        if (currentLikeType === LIKE) {
          setLikeCount((count) => count - 1);
          setSuccessNotification('Like Removed');
        } else {
          setDislikeCount((count) => count - 1);
          setSuccessNotification('Dislike Removed');
        }

        break;
      case LIKE:
        if (currentLikeType === DISLIKE) setDislikeCount((count) => count - 1);
        setLikeCount((count) => count + 1);
        setSuccessNotification('Like Successful');
        break;
      case DISLIKE:
        if (currentLikeType === LIKE) setLikeCount((count) => count - 1);
        setDislikeCount((count) => count + 1);
        setSuccessNotification('Dislike Successful');
        break;
    }
  };
  const publishLike = async (chosenLikeType: LikeType) => {
    if (isLoading) {
      const notificationObj: AltertObject = {
        msg: 'Wait for Like Data to load first',
        alertType: 'error',
      };
      setNotification(notificationObj);

      return;
    }
    if (!likeIdentifier) {
      const notificationObj: AltertObject = {
        msg: 'Unable to construct like identifier',
        alertType: 'error',
      };
      setNotification(notificationObj);
      return;
    }
    try {
      if (!username) throw new Error('You need a name to publish');
      if (!name) throw new Error("Could not retrieve content creator's name");
      if (!identifier) throw new Error('Could not retrieve id of video post');

      if (username === name) {
        const notificationObj: AltertObject = {
          msg: 'You cannot send yourself a like',
          alertType: 'error',
        };
        setNotification(notificationObj);

        return;
      }
      qortalRequest({
        action: 'GET_NAME_DATA',
        name: name,
      }).then((resName) => {
        const address = resName.owner;
        if (!address)
          throw new Error("Could not retrieve content creator's address");
      });

      await qortalRequest({
        action: 'PUBLISH_QDN_RESOURCE',
        name: username,
        service: 'CHAIN_COMMENT',
        data64: await objectToBase64({ likeType: chosenLikeType }),
        title: '',
        identifier: likeIdentifier,
        filename: `like_metadata.json`,
      });

      updateLikeDataState(chosenLikeType);
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError
        ? error?.message
        : 'Failed to publish Like or Dislike';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);

      throw new Error('Failed to publish Super Like');
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <CustomTooltip
          title={t('core:likes.like_dislike', {
            postProcess: 'capitalizeFirstChar',
          })}
          placement="top"
        >
          <Box
            sx={{
              padding: '5px',
              borderRadius: '7px',
              gap: '10px',
              display: 'flex',
              alignItems: 'center',
              marginRight: '20px',
              height: '53px',
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
              >
                <span style={{ marginRight: '10px', paddingBottom: '4px' }}>
                  {formatLikeCount(likeCount)}
                </span>
              </div>
            )}

            {currentLikeType === DISLIKE ? (
              <ThumbDownIcon
                onClick={() => publishLike(NEUTRAL)}
                color={'error'}
              />
            ) : (
              <ThumbDownOffAltOutlinedIcon
                onClick={() => publishLike(DISLIKE)}
                color={'error'}
              />
            )}
            {dislikeCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
              >
                <span
                  style={{
                    marginRight: '10px',
                    paddingBottom: '4px',
                    color: 'red',
                  }}
                >
                  {formatLikeCount(dislikeCount)}
                </span>
              </div>
            )}
          </Box>
        </CustomTooltip>
      </Box>
    </>
  );
};
