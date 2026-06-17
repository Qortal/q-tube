import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useAuth } from 'qapp-core';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTransition } from '../../../components/common/PageTransition.tsx';
import { PlayListComponentLevel } from '../../Home/Components/PlayListComponentLevel.tsx';
import { VideoListComponentLevel } from '../../Home/Components/VideoListComponentLevel.tsx';
import { ChannelActions } from '../VideoContent/ChannelActions.tsx';
import { StyledCardHeaderComment } from '../VideoContent/VideoContent-styles.tsx';
import { ChannelDescription } from './ChannelDescription.tsx';
import { HeaderContainer, ProfileContainer } from './Profile-styles.tsx';
import { useIndividualProfileState } from './IndividualProfile-State.ts';

export const ChannelPage = () => {
  const { t } = useTranslation(['core']);
  const { name } = useAuth();
  const navigate = useNavigate();

  const { name: channelName, section } = useParams();
  const isOwnChannel = channelName === name;
  const { setChannelTab: setSelectedTab } = useIndividualProfileState(isOwnChannel);

  // Derive selectedTab from URL section parameter
  const selectedTab = section === 'playlists' ? 1 : 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const newSection = newValue === 0 ? 'videos' : 'playlists';
    navigate(`/channel/${channelName}/${newSection}`);
    
    // Update persisted state for owned channels (for sidebar button)
    if (isOwnChannel) {
      setSelectedTab(newValue);
    }
  };

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
        {channelName && <ChannelDescription channelName={channelName} />}

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
