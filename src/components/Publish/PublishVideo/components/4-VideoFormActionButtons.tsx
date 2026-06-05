import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormActionButton,
  FormActionButtonRow,
} from '../PublishVideo-styles.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';

interface VideoFormActionButtonsProps {
  editId?: string;
  editContent?: null | {
    title: string;
    user: string;
    coverImage: string | null;
  };
}

export const VideoFormActionButtons: React.FC<VideoFormActionButtonsProps> = ({
  editId,
  editContent,
}) => {
  const { t } = useTranslation(['core']);
  const workflow = usePublishVideo();

  const {
    step,
    onClose,
    setStep,
    files,
    videoDurations,
    imageExtracts,
    playlistSetting,
    playlistTitle,
    playlistDescription,
    playlistCoverImage,
    selectedCategory,
    selectedSubCategory,
    selectExistingPlaylist,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    coverImageForAll,
    isCheckSameCoverImage,
    isCheckTitleByFile,
    isValidQortalLink,
    publishMethod,
    isQortalLinkEmpty,
    next: handleNext,
    publishQDNResource: handlePublishQDNResource,
  } = workflow;

  return (
    <FormActionButtonRow>
      <FormActionButton
        onClick={() => {
          onClose();
        }}
        variant="contained"
        color="error"
      >
        Cancel
      </FormActionButton>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {step === 'playlist' && (
          <FormActionButton
            variant="contained"
            onClick={() => {
              setStep('videos');
            }}
          >
            {t('core:action.back', {
              postProcess: 'capitalizeFirstChar',
            })}
          </FormActionButton>
        )}
        {step === 'playlist' ? (
          <FormActionButton
            variant="contained"
            onClick={() => {
              handlePublishQDNResource(
                files,
                videoDurations,
                imageExtracts,
                playlistSetting,
                playlistTitle,
                playlistDescription,
                playlistCoverImage,
                selectedCategory,
                selectedSubCategory,
                selectedCategoryVideos,
                selectedSubCategoryVideos,
                coverImageForAll,
                isCheckSameCoverImage,
                selectExistingPlaylist,
                editId,
                editContent
              );
            }}
          >
            {t('core:publish.publish_action', {
              postProcess: 'capitalizeFirstChar',
            })}
          </FormActionButton>
        ) : (
          <FormActionButton
            variant="contained"
            disabled={
              (publishMethod === 'files' &&
                (files?.length !== Object.keys(imageExtracts)?.length ||
                  files?.length === 0)) ||
              (publishMethod === 'qortal' && isQortalLinkEmpty)
            }
            onClick={() => {
              handleNext(
                files,
                isCheckSameCoverImage,
                coverImageForAll,
                selectedCategoryVideos,
                isCheckTitleByFile,
                setStep,
                isValidQortalLink,
                publishMethod
              );
            }}
          >
            {publishMethod === 'files' &&
            files?.length !== Object.keys(imageExtracts)?.length
              ? t('core:publish.generationg_extracts', {
                  postProcess: 'capitalizeFirstChar',
                })
              : ''}
            {publishMethod === 'files' &&
              files?.length !== Object.keys(imageExtracts)?.length && (
                <CircularProgress color="secondary" size={14} />
              )}
            {t('core:action.next', {
              postProcess: 'capitalizeFirstChar',
            })}
          </FormActionButton>
        )}
      </Box>
    </FormActionButtonRow>
  );
};
