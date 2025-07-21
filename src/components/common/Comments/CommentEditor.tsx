import { useEffect, useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import { hashWordWithoutPublicSalt, useAuth } from 'qapp-core';

import localforage from 'localforage';
import {
  CommentInput,
  CommentInputContainer,
  SubmitCommentButton,
} from './Comments-styles';

import { COMMENT_BASE } from '../../../constants/Identifiers.ts';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { Box, Button } from '@mui/material';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
const uid = new ShortUniqueId({ length: 7 });

const notification = localforage.createInstance({
  name: 'notification',
});

const MAX_ITEMS = 10;

export interface Item {
  id: string;
  lastSeen: number;
  postId: string;
  postName: string;
}

export async function addItem(item: Item): Promise<void> {
  // Get all items
  const notificationComments: Item[] =
    (await notification.getItem('comments')) || [];

  // Find the item with the same id, if it exists
  const existingItemIndex = notificationComments.findIndex(
    (i) => i.id === item.id
  );

  if (existingItemIndex !== -1) {
    // If the item exists, update its date
    notificationComments[existingItemIndex].lastSeen = item.lastSeen;
  } else {
    // If the item doesn't exist, add it
    notificationComments.push(item);

    // If adding the item has caused us to exceed the max number of items, remove the oldest one
    if (notificationComments.length > MAX_ITEMS) {
      notificationComments.sort((a, b) => b.lastSeen - a.lastSeen); // sort items by date, newest first
      notificationComments.pop(); // remove the oldest item
    }
  }

  // Store the items back into localForage
  await notification.setItem('comments', notificationComments);
}
export async function updateItemDate(item: any): Promise<void> {
  // Get all items
  const notificationComments: Item[] =
    (await notification.getItem('comments')) || [];

  const notificationCreatorComment: any =
    (await notification.getItem('post-comments')) || {};
  const findPostId = notificationCreatorComment[item.postId];
  if (findPostId) {
    notificationCreatorComment[item.postId].lastSeen = item.lastSeen;
  }

  // Find the item with the same id, if it exists
  notificationComments.forEach((nc, index) => {
    if (nc.postId === item.postId) {
      notificationComments[index].lastSeen = item.lastSeen;
    }
  });

  // Store the items back into localForage
  await notification.setItem('comments', notificationComments);
  await notification.setItem('post-comments', notificationCreatorComment);
}
interface CommentEditorProps {
  postId: string;
  postName: string;
  onSubmit: (obj: any) => void;
  isReply?: boolean;
  commentId?: string;
  isEdit?: boolean;
  commentMessage?: string;
  onCloseReply?: () => void;
}

function utf8ToBase64(inputString: string): string {
  // Encode the string as UTF-8
  const utf8String = encodeURIComponent(inputString).replace(
    /%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(Number('0x' + p1))
  );

  // Convert the UTF-8 encoded string to base64
  const base64String = btoa(utf8String);
  return base64String;
}

export const CommentEditor = ({
  onSubmit,
  postId,
  postName,
  isReply,
  commentId,
  isEdit,
  commentMessage,
  onCloseReply,
}: CommentEditorProps) => {
  const isSmall = useIsSmall();
  const [value, setValue] = useState<string>('');
  const { name, address } = useAuth();
  const setNotification = useSetAtom(setNotificationAtom);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (isEdit && commentMessage) {
      setValue(commentMessage);
    }
  }, [isEdit, commentMessage]);

  const publishComment = async (
    identifier: string,
    idForNotification?: string
  ) => {
    let errorMsg = '';

    if (!address) {
      errorMsg = "Cannot post: your address isn't available";
    }
    if (!name) {
      errorMsg = 'Cannot post without a name';
    }

    if (value.length > 200) {
      errorMsg = 'Comment needs to be under 200 characters';
    }

    if (errorMsg) {
      const notificationObj: AltertObject = {
        msg: errorMsg,
        alertType: 'error',
      };
      setNotification(notificationObj);

      throw new Error(errorMsg);
    }

    try {
      const resourceResponse = await qortalRequest({
        action: 'PUBLISH_QDN_RESOURCE',
        name: name,
        service: 'BLOG_COMMENT',
        data64: utf8ToBase64(value),
        identifier: identifier,
      });
      const notificationObj: AltertObject = {
        msg: 'Comment successfully published',
        alertType: 'success',
      };
      setNotification(notificationObj);

      if (idForNotification) {
        addItem({
          id: idForNotification,
          lastSeen: Date.now(),
          postId,
          postName: postName,
        });
      }

      return resourceResponse;
    } catch (error) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Failed to publish comment';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);
      throw new Error('Failed to publish comment');
    }
  };
  const handleSubmit = async () => {
    try {
      const id = uid.rnd();
      const hashPostId = await hashWordWithoutPublicSalt(postId, 20);
      let identifier = `${COMMENT_BASE}${hashPostId}_base_${id}`;
      let idForNotification = identifier;

      if (isReply && commentId) {
        const removeBaseCommentId = commentId;
        removeBaseCommentId.replace('_base_', '');
        identifier = `${COMMENT_BASE}${hashPostId}_reply_${removeBaseCommentId.slice(-6)}_${id}`;
        idForNotification = commentId;
      }
      if (isEdit && commentId) {
        identifier = commentId;
      }

      await publishComment(identifier, idForNotification);
      onSubmit({
        created: Date.now(),
        identifier,
        message: value,
        service: 'BLOG_COMMENT',
        name: name,
      });
      setValue('');
    } catch (error) {
      console.error(error);
    }
  };

  console.log('onCloseReply', onCloseReply);

  return (
    <CommentInputContainer
      sx={{
        width: isSmall ? '100%' : '90%',
      }}
    >
      <CommentInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        id="standard-multiline-flexible"
        label="Your comment"
        multiline
        maxRows={4}
        variant="filled"
        value={value}
        inputProps={{
          maxLength: 200,
        }}
        InputLabelProps={{ style: { fontSize: '18px' } }}
        onChange={(e) => setValue(e.target.value)}
      />

      <Box
        sx={{
          width: '100%',
          justifyContent: 'flex-end',
          display: 'flex',
          gap: '20px',
          visibility: isReply
            ? 'visible'
            : value || isFocused
              ? 'visible'
              : 'hidden',
        }}
      >
        <Button
          onClick={(e) => {
            setValue('');
            if (!onCloseReply) return;
            onCloseReply();
          }}
          variant="text"
        >
          Cancel
        </Button>
        <SubmitCommentButton
          variant="contained"
          color="info"
          onClick={handleSubmit}
        >
          {isReply ? 'Submit reply' : isEdit ? 'Edit' : 'comment'}
        </SubmitCommentButton>
      </Box>
    </CommentInputContainer>
  );
};
