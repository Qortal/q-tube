import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Box, Modal, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useAuth } from 'qapp-core';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { menuIconSize } from '../../../constants/Misc.ts';
import { setNotificationAtom } from '../../../state/global/notifications.ts';
import { AddVideoToPlaylistForm } from './components/3-AddVideoToPlaylistForm.tsx';

// Import components
import { PublishVideoInitializer } from './components/1-PublishVideoInitializer.tsx';
import { VideoFileDataForm } from './components/2-VideoFileDataForm.tsx';
import { VideoFormActionButtons } from './components/4-VideoFormActionButtons.tsx';
import { VideoReferenceDataForm } from './components/2-VideoReferenceDataForm.tsx';

import {
  ModalBody,
  NewCrowdfundTitle,
  StyledButton,
} from './PublishVideo-styles.tsx';

import { PublishVideoProvider } from './PublishVideoContext.tsx';
import { useVideoPublishingWorkflow } from './useVideoPublishingWorkflow.tsx';

interface PublishVideoProps {
  afterClose?: () => void;
}

export const PublishVideo = ({ afterClose }: PublishVideoProps) => {
  const { t } = useTranslation(['core', 'category']);
  const theme = useTheme();
  const setNotification = useSetAtom(setNotificationAtom);
  const { name: username } = useAuth();

  // Initialize the consolidated video publishing workflow
  const workflow = useVideoPublishingWorkflow(setNotification, afterClose);
  const isEditing = false;
  return (
    <>
      {username && (
        <>
          {isEditing ? null : (
            <StyledButton
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
              }}
              color="primary"
              startIcon={
                <VideoLibraryIcon
                  sx={{
                    color: '#FF0033',
                    width: menuIconSize,
                    height: menuIconSize,
                  }}
                />
              }
              onClick={workflow.openModal}
            >
              {t('core:publish.video', {
                postProcess: 'capitalizeFirstChar',
              })}
            </StyledButton>
          )}
        </>
      )}

      <Modal
        open={workflow.isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalBody
          sx={{
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isEditing ? (
              <NewCrowdfundTitle>
                {t('core:publish.update_video', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
              </NewCrowdfundTitle>
            ) : (
              <NewCrowdfundTitle>
                {t('core:publish.publish_videos', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
              </NewCrowdfundTitle>
            )}
          </Box>

          <PublishVideoProvider value={workflow}>
            {workflow.step === 'videos' && (
              <>
                <PublishVideoInitializer />
                {(workflow.files.length > 0 ||
                  (workflow.publishMethod === 'qortal' &&
                    workflow.videoReference)) && (
                  <>
                    {workflow.publishMethod === 'files' && (
                      <VideoFileDataForm />
                    )}
                    {workflow.publishMethod === 'qortal' && (
                      <VideoReferenceDataForm />
                    )}
                  </>
                )}
              </>
            )}
            {workflow.step === 'playlist' && <AddVideoToPlaylistForm />}
            <VideoFormActionButtons />
          </PublishVideoProvider>
        </ModalBody>
      </Modal>
    </>
  );
};
