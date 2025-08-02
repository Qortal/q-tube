import { useMediaQuery } from '@mui/material';

export const useIsSmall = () => {
  return useMediaQuery('(max-width:950px)');
};
