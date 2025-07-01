import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  extractSigValue,
  getPaymentInfo,
  isTimestampWithinRange,
} from '../pages/ContentPages/VideoContent/VideoContent-State.ts';

import NavBar from '../components/layout/Navbar/Navbar';
import PageLoader from '../components/common/PageLoader';
import { RequestQueue } from '../utils/queue';
import { EditVideo } from '../components/Publish/EditVideo/EditVideo';
import { EditPlaylist } from '../components/Publish/EditPlaylist/EditPlaylist';
import ConsentModal from '../components/common/ConsentModal';
import { useFetchSuperLikes } from '../hooks/useFetchSuperLikes';
import { SUPER_LIKE_BASE } from '../constants/Identifiers.ts';
import { minPriceSuperLike } from '../constants/Misc.ts';
import { useHandleNameData } from './../hooks/useHandleNameData.tsx';
import { namesAtom } from './../state/global/names';
import { useAtom, useSetAtom } from 'jotai';
import { useAuth } from 'qapp-core';
import { superlikesAtom } from '../state/global/superlikes.ts';

interface Props {
  children: React.ReactNode;
}

export const queue = new RequestQueue();
export const queueSuperlikes = new RequestQueue();

const GlobalWrapper: React.FC<Props> = ({ children }) => {
  const setSuperlikesAll = useSetAtom(superlikesAtom);
  const { addSuperlikeRawDataGetToList } = useFetchSuperLikes();
  const interval = useRef<any>(null);
  useHandleNameData();
  const { isLoadingUser, address } = useAuth();
  const [names] = useAtom(namesAtom);

  const getSuperlikes = useCallback(async () => {
    try {
      let totalCount = 0;
      let validCount = 0;
      let comments: any[] = [];
      while (validCount < 20 && totalCount < 100) {
        const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&query=${SUPER_LIKE_BASE}&limit=1&offset=${totalCount}&includemetadata=true&reverse=true&excludeblocked=true`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await response.json();
        if (responseData && responseData.length > 0) {
          for (const comment of responseData) {
            if (
              comment.identifier &&
              comment.name &&
              comment?.metadata?.description
            ) {
              try {
                const result = extractSigValue(comment?.metadata?.description);
                if (!result) continue;
                const res = await getPaymentInfo(result);
                if (
                  +res?.amount >= minPriceSuperLike &&
                  isTimestampWithinRange(res?.timestamp, comment.created)
                ) {
                  addSuperlikeRawDataGetToList({
                    name: comment.name,
                    identifier: comment.identifier,
                    content: comment,
                  });
                  comments = [
                    ...comments,
                    {
                      ...comment,
                      message: '',
                      amount: res.amount,
                    },
                  ];
                  validCount++;
                }
              } catch (error) {
                console.error(error);
              }
            }
          }
        }
        totalCount++;
      }
      setSuperlikesAll(comments);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const checkSuperlikes = useCallback(() => {
    let isCalling = false;
    interval.current = setInterval(async () => {
      if (isCalling) return;
      isCalling = true;
      const res = await getSuperlikes();
      isCalling = false;
    }, 300000);
    getSuperlikes();
  }, [getSuperlikes]);

  useEffect(() => {
    checkSuperlikes();
  }, [checkSuperlikes]);

  return (
    <>
      {isLoadingUser && <PageLoader />}
      <ConsentModal />
      <EditVideo />
      <EditPlaylist />

      {children}
    </>
  );
};

export default GlobalWrapper;
