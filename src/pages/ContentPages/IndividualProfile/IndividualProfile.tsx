import { Box, Tabs, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoListComponentLevel } from '../../Home/Components/VideoListComponentLevel.tsx';
import { PlayListComponentLevel } from '../../Home/Components/PlayListComponentLevel.tsx';
import { ChannelActions } from '../VideoContent/ChannelActions.tsx';
import { StyledCardHeaderComment } from '../VideoContent/VideoContent-styles.tsx';
import { HeaderContainer, ProfileContainer } from './Profile-styles.tsx';
import { PageTransition } from '../../../components/common/PageTransition.tsx';
import { useTranslation } from 'react-i18next';

export const IndividualProfile = () => {
  const { t } = useTranslation(['core']);

  const { name: channelName } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { name, section } = useParams();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (section === 'videos') {
      setSelectedTab(0);
    }
    if (section === 'playlists') {
      setSelectedTab(1);
    }
  }, [section]);

  return (
    <PageTransition>
      <ProfileContainer>
        <HeaderContainer>
          <Box
            sx={{
              cursor: 'pointer',
            }}
          >
            <StyledCardHeaderComment
              sx={{
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                },
              }}
            >
              <ChannelActions channelName={channelName || ''} />
            </StyledCardHeaderComment>
          </Box>
        </HeaderContainer>

        {/* Tabs Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab
              label={t('core:filters.videos', {
                postProcess: 'capitalizeFirstChar',
              })}
            />
            <Tab
              label={t('core:filters.playlists', {
                postProcess: 'capitalizeFirstChar',
              })}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <PageTransition>
            <VideoListComponentLevel />
          </PageTransition>
        )}
        {selectedTab === 1 && (
          <PageTransition>
            <PlayListComponentLevel />
          </PageTransition>
        )}
      </ProfileContainer>
    </PageTransition>
  );
};
