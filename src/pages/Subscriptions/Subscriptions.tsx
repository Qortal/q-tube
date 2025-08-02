import { Box, Divider } from '@mui/material';
import { useMemo } from 'react';

import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../constants/Identifiers.ts';
import { QortalSearchParams, Spacer, useAuth } from 'qapp-core';
import { useSearchParams } from 'react-router-dom';
import { ScrollToTopButton } from '../../components/common/ScrollToTopButton.tsx';
import { useAtomValue, useSetAtom } from 'jotai';
import { scrollRefAtom } from '../../state/global/navbar.ts';
import { useHomeState } from '../Home/Home-State.ts';
import VideoList from '../Home/Components/VideoList.tsx';
import { PageSubTitle } from '../../components/common/General/GeneralStyles.tsx';
import { PageTransition } from '../../components/common/PageTransition.tsx';
import { useTranslation } from 'react-i18next';

export const Subscriptions = () => {
  const { t } = useTranslation(['core']);

  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useAtomValue(scrollRefAtom);

  const query = searchParams.get('query'); // "example"
  // const page = searchParams.get('page'); // "2"
  const { isHydrated, subscriptions } = useHomeState();

  const searchParameters: QortalSearchParams | null = useMemo(() => {
    if (!subscriptions || subscriptions?.length === 0) return null;
    if (!isHydrated) return null;
    const searchOptions: {
      description?: string;
      query?: string;
      names?: string[];
      name?: string;
    } = {};

    searchOptions.names = subscriptions?.map((n) => n?.subscriberName);

    return {
      identifier: QTUBE_VIDEO_BASE,
      service: 'DOCUMENT',
      offset: 0,
      reverse: true,
      limit: 20,
      ...searchOptions,
      mode: 'ALL',
    };
  }, [isHydrated, subscriptions]);

  return (
    <PageTransition>
      <Box
        sx={{
          paddingTop: '10px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '95%',
            }}
          >
            <PageSubTitle
              sx={{
                alignSelf: 'flex-start',
              }}
            >
              {t('core:sidenav.subscriptions', {
                postProcess: 'capitalizeFirstChar',
              })}
            </PageSubTitle>
            <Spacer height="14px" />
            <Divider flexItem />
            <Spacer height="20px" />
          </Box>

          {searchParameters && (
            <VideoList
              listName="subscriptions"
              searchParameters={searchParameters}
            />
          )}
        </Box>
      </Box>
      <ScrollToTopButton scrollRef={scrollRef} />
    </PageTransition>
  );
};
