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

export const History = () => {
  const [watchedHistory, setWatchedHistory, isHydratedWatchedHistory] =
    usePersistedState('watched-v1', []);

  if (!isHydratedWatchedHistory) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <PageSubTitle
          sx={{
            alignSelf: 'flex-start',
          }}
        >
          Your History
        </PageSubTitle>

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
    </>
  );
};
