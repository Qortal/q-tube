import localforage from 'localforage';
import { useEffect, useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import { COMMENT_BASE } from '../../../constants/Identifiers.ts';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import {
  CommentInput,
  CommentInputContainer,
  SubmitCommentButton,
} from './Comments-styles';
import { hashWordWithoutPublicSalt, useAuth } from 'qapp-core';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { addToHashMapSuperlikesAtom } from '../../../state/global/superlikes.ts';

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
  isSuperLike?: boolean;
  comment?: any;
  hasHash?: boolean;
}

export function utf8ToBase64(inputString: string): string {
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
  isSuperLike,
  comment,
  hasHash,
}: CommentEditorProps) => {
  const [value, setValue] = useState<string>('');
  const setNotification = useSetAtom(setNotificationAtom);
  const addSuperlike = useSetAtom(addToHashMapSuperlikesAtom);

  const { name, address } = useAuth();
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
      let dataFile: string = null;
      let description = '';
      let tag1 = '';
      let superObj = {};
      if (isSuperLike) {
        if (
          !comment?.metadata?.description ||
          !comment?.metadata?.tags[0] ||
          !comment?.transactionReference ||
          !comment?.notificationInformation ||
          !comment?.about
        )
          throw new Error('unable to edit Super like');
        description = comment?.metadata?.description;
        tag1 = comment?.metadata?.tags[0];
        superObj = {
          comment: value,
          transactionReference: comment.transactionReference,
          notificationInformation: comment.notificationInformation,
          about: comment.about,
        };
        dataFile = await objectToBase64(superObj);
      }
      if (isSuperLike && !dataFile)
        throw new Error('unable to edit Super like');
      const resourceResponse = await qortalRequest({
        action: 'PUBLISH_QDN_RESOURCE',
        name: name,
        service: 'BLOG_COMMENT',
        data64: isSuperLike ? dataFile : utf8ToBase64(value),
        identifier: identifier,
        description,
        tags: [tag1],
      });
      const notificationObj: AltertObject = {
        msg: 'Comment successfully published',
        alertType: 'success',
      };
      setNotification(notificationObj);

      if (isSuperLike) {
        addSuperlike({
          ...superObj,
          ...comment,
          message: value,
        });
      }
      if (idForNotification) {
        addItem({
          id: idForNotification,
          lastSeen: Date.now(),
          postId,
          postName: postName,
        });
      }

      return resourceResponse;
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Failed to publish Comment';
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
      const service = 'BLOG_COMMENT';
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
      if (isSuperLike) {
        onSubmit({});
      } else {
        onSubmit({
          created: Date.now(),
          identifier,
          message: value,
          service,
          name: name,
        });
      }

      setValue('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CommentInputContainer>
      <CommentInput
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

      <SubmitCommentButton
        color="info"
        variant="contained"
        onClick={handleSubmit}
      >
        {isReply ? 'Submit reply' : isEdit ? 'Edit' : 'Submit comment'}
      </SubmitCommentButton>
    </CommentInputContainer>
  );
};
