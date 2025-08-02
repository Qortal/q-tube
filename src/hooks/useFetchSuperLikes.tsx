import React, { useCallback } from 'react';

import { queueSuperlikes } from '../wrappers/GlobalWrapper';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  addToHashMapSuperlikesAtom,
  hashMapSuperlikesAtom,
} from '../state/global/superlikes';

export const useFetchSuperLikes = () => {
  const addSuperlike = useSetAtom(addToHashMapSuperlikesAtom);
  const hashMapSuperlikes = useAtomValue(hashMapSuperlikesAtom);

  const checkAndUpdateSuperlike = React.useCallback(
    (superlike: any) => {
      const existingVideo = hashMapSuperlikes[superlike.identifier];
      if (!existingVideo) {
        return true;
      } else if (
        superlike?.updated &&
        existingVideo?.updated &&
        (!existingVideo?.updated || superlike?.updated) > existingVideo?.updated
      ) {
        return true;
      } else {
        return false;
      }
    },
    [hashMapSuperlikes]
  );

  const fetchSuperlike = async (data: any) => {
    const getsuper = async () => {
      const { user, videoId, content } = data;
      let obj: any = {
        ...content,
        isValid: false,
      };

      if (!user || !videoId) return obj;

      try {
        const responseData = await qortalRequest({
          action: 'FETCH_QDN_RESOURCE',
          name: user,
          service: content?.service || 'BLOG_COMMENT',
          identifier: videoId,
        });

        obj = {
          ...content,
          ...responseData,
          isValid: true,
        };

        return obj;
      } catch (error: any) {
        throw new Error(error?.message || 'error');
      }
    };

    const res = await getsuper();
    return res;
  };

  const getSuperLikes = async (
    user: string,
    videoId: string,
    content: any,
    retries: number = 0
  ) => {
    try {
      const res = await fetchSuperlike({
        user,
        videoId,
        content,
      });
      addSuperlike(res);
    } catch (error) {
      retries = retries + 1;
      if (retries < 2) {
        // 3 is the maximum number of retries here, you can adjust it to your needs
        queueSuperlikes.push(() =>
          getSuperLikes(user, videoId, content, retries + 1)
        );
      } else {
        console.error('Failed to get video after 3 attempts', error);
      }
    }
  };

  const addSuperlikeRawDataGetToList = useCallback(
    ({ name, identifier, content }) => {
      if (name && identifier) {
        const res = checkAndUpdateSuperlike(content);
        if (res) {
          queueSuperlikes.push(() => getSuperLikes(name, identifier, content));
        }
      }
    },
    [checkAndUpdateSuperlike]
  );

  return {
    addSuperlikeRawDataGetToList,
  };
};
