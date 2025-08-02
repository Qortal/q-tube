import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { VideoManagerRow } from './VideoList-styles.tsx';

import VideoList from './VideoList.tsx';
import { QortalSearchParams } from 'qapp-core';
import { QTUBE_PLAYLIST_BASE } from '../../../constants/Identifiers.ts';

export const PlayListComponentLevel = () => {
  const { name: paramName } = useParams();

  const searchParameters: QortalSearchParams = useMemo(() => {
    return {
      identifier: QTUBE_PLAYLIST_BASE,
      service: 'PLAYLIST',
      offset: 0,
      reverse: true,
      limit: 20,
      excludeBlocked: true,
      name: paramName || '',
      mode: 'ALL',
      exactmatchnames: true,
    };
  }, [paramName]);

  return (
    <VideoManagerRow>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <VideoList
          listName="ChannelPlaylists"
          searchParameters={searchParameters}
        />
      </Box>
    </VideoManagerRow>
  );
};
