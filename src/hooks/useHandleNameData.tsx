import { useSetAtom } from 'jotai';
import { namesAtom } from '../state/global/names';
import { useCallback, useEffect } from 'react';

import { useAuth } from 'qapp-core';

export const useHandleNameData = () => {
  const setNames = useSetAtom(namesAtom);
  const { address } = useAuth();
  const getMyNames = useCallback(async () => {
    if (!address) return;
    try {
      const res = await qortalRequest({
        action: 'GET_ACCOUNT_NAMES',
        address: address,
        limit: 0,
        offset: 0,
        reverse: false,
      });
      setNames(res);
    } catch (error) {
      console.error(error);
    }
  }, [address, setNames]);

  // Initial fetch + interval
  useEffect(() => {
    getMyNames();
    const interval = setInterval(getMyNames, 120_000); // every 2 minutes
    return () => clearInterval(interval);
  }, [getMyNames]);

  return null;
};
