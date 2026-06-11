import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormActionButton,
  FormActionButtonRow,
} from '../PublishVideo-styles.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';

export const VideoFormActionButtons: React.FC = ({}) => {
  const { t } = useTranslation(['core']);
  const workflow = usePublishVideo();

  const {
    step,
    onClose,
    setStep,
    files,
    videoDurations,
    videoFramesExtracted,
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
    isValidQortalLink,
    publishMethod,
    isQortalLinkEmpty,
    next: handleNext,
    publishQDNResource: handlePublishQDNResource,
  } = workflow;

  // Check if all videos have both duration and frames extracted
  const allVideosComplete =
    files.length > 0 &&
    files.every((_, index) => {
      const hasDuration = videoDurations[index] > 0;
      const hasFrames = videoFramesExtracted[index];
      return hasDuration && hasFrames;
    });

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
                selectExistingPlaylist
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
                  files?.length === 0 ||
                  !allVideosComplete)) ||
              (publishMethod === 'qortal' && isQortalLinkEmpty)
            }
            onClick={() => {
              handleNext(
                files,
                isCheckSameCoverImage,
                coverImageForAll,
                selectedCategoryVideos,
                setStep,
                isValidQortalLink,
                publishMethod
              );
            }}
          >
            {publishMethod === 'files' &&
            files.length > 0 &&
            (files?.length !== Object.keys(imageExtracts)?.length ||
              !allVideosComplete)
              ? t('core:publish.processing_videos', {
                  postProcess: 'capitalizeFirstChar',
                })
              : ''}
            {publishMethod === 'files' &&
              files.length > 0 &&
              (files?.length !== Object.keys(imageExtracts)?.length ||
                !allVideosComplete) && (
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
