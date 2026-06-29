import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Box, Button, Divider } from '@mui/material';
import { Spacer, useGlobal } from 'qapp-core';
import { useEffect } from 'react';
import { PageSubTitle } from '../../components/common/General/GeneralStyles.tsx';
import { PageTransition } from '../../components/common/PageTransition.tsx';
import { useIsSmall } from '../../hooks/useIsSmall.tsx';
import { usePersistedState } from '../../state/persist/persist.ts';
import { VideoListPreloaded } from '../Home/Components/VideoListPreloaded.tsx';

export const History = () => {
  const { lists } = useGlobal();
  const isSmall = useIsSmall();
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState('watched-v1', []);

  // useEffect(() => {  // print statement for debugging
  //   if (isHydratedWatchedHistory && watchedHistory?.length > 0) {
  //     console.log(`Video History: `, watchedHistory);
  //   }
  // }, [isHydratedWatchedHistory, watchedHistory]);

  if (!isHydratedWatchedHistory) {
    return null;
  }

  return (
    <PageTransition>
      <Box
        sx={{
          paddingTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: isSmall ? 'center' : 'flex-start',
        }}
      >
        <PageSubTitle>Your History</PageSubTitle>

        <Spacer height="10px" />
        {watchedHistory?.length > 0 && isHydratedWatchedHistory && (
          <Button
            size="small"
            onClick={() => {
              if (isHydratedWatchedHistory) {
                setWatchedHistory([]);
                lists.deleteList('watched-history');
              }
            }}
            variant="outlined"
            startIcon={<ClearAllIcon />}
          >
            Clear
          </Button>
        )}
        <Spacer height="10px" />

        <Divider flexItem />
        <Spacer height="20px" />
      </Box>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <VideoListPreloaded
            listName={`watched-history`}
            videoList={watchedHistory}
            disableActions
          />
        </Box>
      </Box>
    </PageTransition>
  );
};
