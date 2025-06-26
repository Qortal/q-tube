import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  extractSigValue,
  getPaymentInfo,
  isTimestampWithinRange,
} from '../pages/ContentPages/VideoContent/VideoContent-State.ts';

import { addUser } from '../state/features/authSlice';
import NavBar from '../components/layout/Navbar/Navbar';
import PageLoader from '../components/common/PageLoader';
import { RootState } from '../state/store';
import {
  setSuperlikesAll,
  setUserAvatarHash,
} from '../state/features/globalSlice';
import { Rnd } from 'react-rnd';
import { RequestQueue } from '../utils/queue';
import { EditVideo } from '../components/Publish/EditVideo/EditVideo';
import { EditPlaylist } from '../components/Publish/EditPlaylist/EditPlaylist';
import ConsentModal from '../components/common/ConsentModal';
import { useFetchSuperLikes } from '../hooks/useFetchSuperLikes';
import { SUPER_LIKE_BASE } from '../constants/Identifiers.ts';
import { minPriceSuperLike } from '../constants/Misc.ts';
import { useHandleNameData } from './../hooks/useHandleNameData.tsx';
import { namesAtom } from './../state/global/names';
import { useAtom } from 'jotai';
import { getPrimaryAccountName } from '../utils/qortalRequestFunctions.ts';

interface Props {
  children: React.ReactNode;
}

let timer: number | null = null;

export const queue = new RequestQueue();
export const queueSuperlikes = new RequestQueue();

const GlobalWrapper: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [userAvatar, setUserAvatar] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);
  const { addSuperlikeRawDataGetToList } = useFetchSuperLikes();
  const interval = useRef<any>(null);
  useHandleNameData();

  const username = useMemo(() => {
    if (!user?.name) return '';

    return user.name;
  }, [user]);

  const [names] = useAtom(namesAtom);

  const getAvatar = React.useCallback(
    async (author: string) => {
      try {
        const url = `/arbitrary/THUMBNAIL/${author}/qortal_avatar`;

        if (url) {
          setUserAvatar(url);
          dispatch(
            setUserAvatarHash({
              name: author,
              url,
            })
          );
        }
      } catch (error) {
        /* empty */
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!username) return;

    getAvatar(username);
  }, [username, getAvatar]);

  const { isLoadingGlobal } = useSelector((state: RootState) => state.global);

  const askForAccountInformation = React.useCallback(async () => {
    try {
      const account = await qortalRequest({
        action: 'GET_USER_ACCOUNT',
      });

      const name = await getPrimaryAccountName(account.address);
      dispatch(addUser({ ...account, name }));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  React.useEffect(() => {
    askForAccountInformation();
  }, [askForAccountInformation]);

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
                console.log(error);
              }
            }
          }
        }
        totalCount++;
      }
      dispatch(setSuperlikesAll(comments));
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
      {isLoadingGlobal && <PageLoader />}
      <ConsentModal />
      <EditVideo />
      <EditPlaylist />
      <NavBar
        isAuthenticated={!!user?.name}
        userName={user?.name || ''}
        allNames={names}
        userAvatar={userAvatar}
        authenticate={askForAccountInformation}
      />

      {children}
    </>
  );
};

export default GlobalWrapper;
