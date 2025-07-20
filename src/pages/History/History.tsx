import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../constants/Identifiers.ts';
import { QortalSearchParams, Spacer, useAuth, useGlobal } from 'qapp-core';
import { useSearchParams } from 'react-router-dom';
import { ScrollToTopButton } from '../../components/common/ScrollToTopButton.tsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { scrollRefAtom } from '../../state/global/navbar.ts';
import { useHomeState } from '../Home/Home-State.ts';
import VideoList from '../Home/Components/VideoList.tsx';
import { VideoListPreloaded } from '../Home/Components/VideoListPreloaded.tsx';
import { usePersistedState } from '../../state/persist/persist.ts';
import { PageSubTitle } from '../../components/common/General/GeneralStyles.tsx';
import EditIcon from '@mui/icons-material/Edit';
import { PageTransition } from '../../components/common/PageTransition.tsx';
import { useIsSmall } from '../../hooks/useIsSmall.tsx';

export const History = () => {
  const isSmall = useIsSmall();
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState('watched-v1', []);

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

        <Spacer height="14px" />
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
