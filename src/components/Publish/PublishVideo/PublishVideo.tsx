import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Box, Modal, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useAuth } from 'qapp-core';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { menuIconSize } from '../../../constants/Misc.ts';
import { setNotificationAtom } from '../../../state/global/notifications.ts';
import { AddVideoToPlaylistForm } from './components/AddVideoToPlaylistForm.tsx';

// Import components
import { PublishVideoInitializer } from './components/PublishVideoInitializer.tsx';
import { VideoDataForm } from './components/VideoDataForm.tsx';
import { VideoFormActionButtons } from './components/VideoFormActionButtons.tsx';

import {
  ModalBody,
  NewCrowdfundTitle,
  StyledButton,
} from './PublishVideo-styles.tsx';

import { usePlaylistManagement } from './videoFormHooks/usePlaylistManagement.tsx';
import { usePublishWorkflow } from './videoFormHooks/usePublishWorkflow.tsx';
import { useQDNPublishing } from './videoFormHooks/useQDNPublishing.tsx';
import { useVideoForm } from './videoFormHooks/useVideoForm.tsx';

// Import custom videoFormHooks
import { useVideoUpload } from './videoFormHooks/useVideoUpload.tsx';

interface PublishVideoProps {
  editId?: string;
  editContent?: null | {
    title: string;
    user: string;
    coverImage: string | null;
  };
  afterClose?: () => void;
}

export const PublishVideo = ({
  editId,
  editContent,
  afterClose,
}: PublishVideoProps) => {
  const { t } = useTranslation(['core', 'category']);
  const theme = useTheme();
  const setNotification = useSetAtom(setNotificationAtom);
  const { name: username } = useAuth();

  // Initialize workflow first
  const publishWorkflow = usePublishWorkflow(afterClose);

  // Initialize form state
  const videoForm = useVideoForm();

  // Initialize video upload with form state
  const videoUpload = useVideoUpload(
    videoForm.isCheckTitleByFile,
    videoForm.titlesPrefix,
    setNotification
  );

  // Initialize playlist management
  const playlistManagement = usePlaylistManagement(username || '');

  // Initialize publishing with onClose
  const qdnPublishing = useQDNPublishing(
    setNotification,
    publishWorkflow.onClose
  );

  return (
    <>
      {username && (
        <>
          {editId ? null : (
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
              onClick={publishWorkflow.openModal}
            >
              {t('core:publish.video', {
                postProcess: 'capitalizeFirstChar',
              })}
            </StyledButton>
          )}
        </>
      )}

      <Modal
        open={publishWorkflow.isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalBody
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {editId ? (
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

          {publishWorkflow.step === 'videos' && (
            <>
              <PublishVideoInitializer
                videoForm={videoForm}
                videoUpload={videoUpload}
              />
              <VideoDataForm videoForm={videoForm} videoUpload={videoUpload} />
            </>
          )}
          {publishWorkflow.step === 'playlist' && (
            <AddVideoToPlaylistForm playlistManagement={playlistManagement} />
          )}
          <VideoFormActionButtons
            publishWorkflow={publishWorkflow}
            videoUpload={videoUpload}
            playlistManagement={playlistManagement}
            videoForm={videoForm}
            qdnPublishing={qdnPublishing}
            editId={editId}
            editContent={editContent}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
