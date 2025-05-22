import { useSetAtom } from 'jotai';
import { namesAtom } from '../state/global/names';
import { useCallback, useEffect } from 'react';
//import { useGlobal } from 'qapp-core';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export const useHandleNameData = () => {
  const setNames = useSetAtom(namesAtom);
  const user = useSelector((state: RootState) => state.auth.user);

  const getMyNames = useCallback(async () => {
    if (!user?.address) return;
    try {
      const res = await qortalRequest({
        action: 'GET_ACCOUNT_NAMES',
        address: user.address,
        limit: 0,
        offset: 0,
        reverse: false,
      });
      setNames(res);
    } catch (error) {
      console.error(error);
    }
  }, [user?.address, setNames]);  

  // Initial fetch + interval
  useEffect(() => {
    getMyNames();
    const interval = setInterval(getMyNames, 120_000); // every 2 minutes
    return () => clearInterval(interval);
  }, [getMyNames]);
  
  return null;
};
