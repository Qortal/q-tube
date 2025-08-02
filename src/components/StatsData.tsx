import { useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid } from '@mui/material';
import { useFetchVideos } from '../hooks/useFetchVideos.tsx';
import { useAtom } from 'jotai';
import {
  totalNamesPublishedAtom,
  totalVideosPublishedAtom,
  videosPerNamePublishedAtom,
} from '../state/global/stats.ts';

/* eslint-disable react-refresh/only-export-components */

export const StatsData = () => {
  const [totalVideosPublished] = useAtom(totalVideosPublishedAtom);
  const [totalNamesPublished] = useAtom(totalNamesPublishedAtom);
  const [videosPerNamePublished] = useAtom(videosPerNamePublishedAtom);

  const StatsCol = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '20px 0px',
    backgroundColor: theme.palette.background.default,
  }));

  const { getVideosCount } = useFetchVideos();

  const showValueIfExists = (value: number) => {
    return value > 0 ? 'inline' : 'none';
  };

  const showVideoCount = showValueIfExists(totalVideosPublished);
  const showPublisherCount = showValueIfExists(totalNamesPublished);
  const showAverage = showValueIfExists(videosPerNamePublished);
  useEffect(() => {
    getVideosCount();
  }, [getVideosCount]);

  return (
    <StatsCol sx={{ display: 'block' }}>
      <div>
        Videos:{' '}
        <span style={{ fontWeight: 'bold', display: showVideoCount }}>
          {totalVideosPublished}
        </span>
      </div>
      <div>
        Publishers:{' '}
        <span style={{ fontWeight: 'bold', display: showPublisherCount }}>
          {totalNamesPublished}
        </span>
      </div>
      <div>
        Average:{' '}
        <span
          style={{
            fontWeight: 'bold',
            display: showAverage,
          }}
        >
          {Number(videosPerNamePublished).toFixed(0)}
        </span>
      </div>
    </StatsCol>
  );
};
