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

import { useVideoPublishingWorkflow } from './videoFormHooks/useVideoPublishingWorkflow.tsx';

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

  // Initialize the consolidated video publishing workflow
  const workflow = useVideoPublishingWorkflow(setNotification, afterClose);

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

          {workflow.step === 'videos' && (
            <>
              <PublishVideoInitializer
                videoForm={workflow}
                videoUpload={workflow}
                isCheckTitleByFile={workflow.isCheckTitleByFile}
                setIsCheckTitleByFile={workflow.setIsCheckTitleByFile}
                isCheckSameCoverImage={workflow.isCheckSameCoverImage}
                setIsCheckSameCoverImage={workflow.setIsCheckSameCoverImage}
                titlesPrefix={workflow.titlesPrefix}
                setTitlesPrefix={workflow.setTitlesPrefix}
                publishMethod={workflow.publishMethod}
              />
              {(workflow.files.length > 0 || (workflow.publishMethod === 'qortal' && workflow.videoReference)) && (
                <VideoDataForm videoForm={workflow} videoUpload={workflow} />
              )}
            </>
          )}
          {workflow.step === 'playlist' && (
            <AddVideoToPlaylistForm playlistManagement={workflow} />
          )}
          <VideoFormActionButtons
            publishWorkflow={workflow}
            videoUpload={workflow}
            playlistManagement={workflow}
            videoForm={workflow}
            qdnPublishing={workflow}
            editId={editId}
            editContent={editContent}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
