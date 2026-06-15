import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { QortalGetMetadata, useResourceStatus } from 'qapp-core';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as mime from 'mime-types';
import { fontSizeLarge, fontSizeMedium } from '../../../../constants/Misc.ts';
import { PublishSearch } from '../../../common/PublishSearch/PublishSearch.tsx';
import { CustomInputField } from '../PublishVideo-styles.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';

export const FileLoader: React.FC = () => {
  const { t } = useTranslation(['core']);
  const workflow = usePublishVideo();

  const {
    getRootProps,
    getInputProps,
    setIsValidQortalLink,
    setPublishMethod,
    setIsQortalLinkEmpty,
    setFetchedVideoData,
    setVideoTitle,
    videoReference,
    setVideoReference,
    setIsVideoDownloading,
    setVideoDownloadProgress,
    setVideoFileExtension,
    isCheckSameCoverImage,
    setIsCheckSameCoverImage,
    titlesPrefix,
    setTitlesPrefix,
    publishMethod,
    setFiles,
    setVideoDurations,
    setVideoFramesExtracted,
    setImageExtracts,
    setVideoReferenceDescription,
    setVideoReferenceCoverImage,
    files,
    videoDurations,
    videoFramesExtracted,
    setVideoProcessingProgress,
    setFramesExtractedCount,
  } = workflow;

  const [isDownloading, setIsDownloading] = useState(false);
  const [videoResource, setVideoResource] = useState<QortalGetMetadata | null>(
    null
  );
  const [currentPercent, setCurrentPercent] = useState<number | undefined>(
    undefined
  );
  const [showDownloadComplete, setShowDownloadComplete] =
    useState<boolean>(false);
  const processedVideoRef = useRef<string | null>(null);
  const previousPublishMethod = useRef<string>(publishMethod);

  // Determine if videos are being processed (frame extraction and duration calculation)
  const isProcessingVideos =
    files.length > 0 &&
    files.some((_, index) => {
      const hasDuration =
        videoDurations[index] !== undefined && videoDurations[index] > 0;
      const hasFrames = videoFramesExtracted[index];
      return !hasDuration || !hasFrames;
    });

  // Determine if video reference is being processed (frame extraction and duration calculation)
  const isProcessingVideoReference =
    videoReference &&
    (videoDurations[0] === undefined ||
      videoDurations[0] === 0 ||
      videoFramesExtracted[0] === false);

  // Update parent component when validation state changes
  React.useEffect(() => {
    setIsValidQortalLink(!!videoReference);
  }, [videoReference, setIsValidQortalLink]);

  // Update parent component when link empty state changes
  React.useEffect(() => {
    setIsQortalLinkEmpty(!videoReference);
  }, [videoReference, setIsQortalLinkEmpty]);

  // Handle video reference changes
  React.useEffect(() => {
    if (videoReference) {
      const videoId = `${videoReference.identifier}_${videoReference.name}`;
      if (processedVideoRef.current !== videoId && !isDownloading) {
        processedVideoRef.current = videoId;
        handleVideoSelect(videoReference);
      }
    }
  }, [videoReference]);

  // Reset form state when switching between publish methods
  React.useEffect(() => {
    // Only reset if the publish method has actually changed
    if (previousPublishMethod.current !== publishMethod) {
      // Reset all form state to prevent data mixing between publish types
      setFiles([]);
      setVideoDurations([]);
      setVideoFramesExtracted([]);
      setImageExtracts({});
      setVideoReference(null);
      setFetchedVideoData(null);
      setVideoTitle('');
      setVideoReferenceDescription('');
      setVideoReferenceCoverImage('');
      setVideoFileExtension('');
      setIsValidQortalLink(false);
      setIsQortalLinkEmpty(true);

      // Reset progress-related states
      setVideoProcessingProgress(0);
      setFramesExtractedCount([]);

      // Reset download-related states
      processedVideoRef.current = null;
      setIsDownloading(false);
      setVideoResource(null);
      setCurrentPercent(undefined);
      setShowDownloadComplete(false);
      setIsVideoDownloading(false);
      setVideoDownloadProgress(undefined);

      // Update the previous publish method
      previousPublishMethod.current = publishMethod;
    }
  }, [
    publishMethod,
    setFiles,
    setVideoDurations,
    setVideoFramesExtracted,
    setImageExtracts,
    setVideoReference,
    setFetchedVideoData,
    setVideoTitle,
    setVideoReferenceDescription,
    setVideoReferenceCoverImage,
    setVideoFileExtension,
    setIsValidQortalLink,
    setIsQortalLinkEmpty,
    setIsVideoDownloading,
    setVideoProcessingProgress,
    setFramesExtractedCount,
  ]);

  // Track download progress
  const { isReady, percentLoaded } = useResourceStatus({
    resource: isDownloading ? videoResource : null,
    retryAttempts: 200,
  });

  const isDownloadComplete = isReady;

  // Update current percent only when percentLoaded is valid and greater than 0
  React.useEffect(() => {
    if (percentLoaded !== undefined && percentLoaded > 0) {
      const percent = Math.floor(percentLoaded);
      setCurrentPercent(percent);
      setVideoDownloadProgress(percent);
    }
  }, [percentLoaded, setVideoDownloadProgress]);
  // Handle video selection from PublishSearch
  const handleVideoSelect = async (selectedVideo) => {
    try {
      setIsDownloading(true);
      setCurrentPercent(undefined); // Reset percent for new download
      setShowDownloadComplete(false); // Reset download complete message
      setVideoDownloadProgress(undefined); // Reset download progress

      // Notify parent component that download is starting
      setIsVideoDownloading(true);

      // Set video resource for download tracking
      setVideoResource({
        name: selectedVideo.name,
        identifier: selectedVideo.identifier,
        service: selectedVideo.service,
      });

      // Fetch video metadata to get the mimetype
      try {
        const metadata = await qortalRequest({
          action: 'GET_QDN_RESOURCE_METADATA',
          name: selectedVideo.name,
          service: selectedVideo.service,
          identifier: selectedVideo.identifier,
        });

        if (metadata?.mimeType) {
          const extension = mime.extension(metadata.mimeType);
          if (extension) {
            setVideoFileExtension(`.${extension}`);
          }
        }
      } catch (metadataError) {
        console.error('Error fetching video metadata:', metadataError);
        // Continue without extension if metadata fetch fails
      }

      // Set the title and filename immediately when video is selected
      if (selectedVideo.metadata?.title) {
        setVideoTitle(selectedVideo.metadata.title);
      } else if (selectedVideo.title) {
        // Fallback to title if metadata.title is not available
        setVideoTitle(selectedVideo.title);
      } else if (selectedVideo.name) {
        // Final fallback to name if neither metadata.title nor title is available
        setVideoTitle(selectedVideo.name);
      }

      // Notify parent component
      setFetchedVideoData(selectedVideo);
    } catch (error) {
      console.error('Error selecting video:', error);
      setIsDownloading(false);
      setCurrentPercent(undefined);
      setShowDownloadComplete(false);
      setVideoDownloadProgress(undefined);
      processedVideoRef.current = null; // Reset on error to allow retry

      // Notify parent component that download has stopped
      setIsVideoDownloading(false);
      // You might want to show an error notification here
    }
  };

  // Handle download completion
  React.useEffect(() => {
    if (isDownloadComplete && isDownloading) {
      // Title is already set when video is selected, no need to set it again here

      setIsDownloading(false);
      setShowDownloadComplete(true);
      setCurrentPercent(undefined);
      setVideoDownloadProgress(100); // Set to 100% when complete
      processedVideoRef.current = null; // Reset to allow re-selection if needed

      // Notify parent component that download has completed
      setIsVideoDownloading(false);
    }
  }, [isDownloadComplete, isDownloading, setIsVideoDownloading]);

  const isInProcessing =
    isProcessingVideos || isProcessingVideoReference || isDownloading;
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Tooltip
          title={
            isInProcessing
              ? 'Cannot change publish method while videos are processing'
              : ''
          }
          disableHoverListener={!isInProcessing}
          arrow
          slotProps={{
            tooltip: {
              sx: {
                fontSize: fontSizeMedium,
              },
            },
          }}
        >
          <RadioGroup
            value={publishMethod}
            onChange={(e) => {
              const newMethod = e.target.value;
              setPublishMethod(newMethod);
            }}
            row
          >
            <FormControlLabel
              value="files"
              control={<Radio />}
              label="Publish Video Files"
              disabled={isInProcessing}
            />
            <FormControlLabel
              value="qortal"
              control={<Radio />}
              label="Publish Video Reference"
              disabled={isInProcessing}
            />
          </RadioGroup>
        </Tooltip>
      </Box>

      {publishMethod === 'files' && (
        <>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>
                {t('core:publish.same_cover_images', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Typography>
              <Checkbox
                checked={isCheckSameCoverImage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIsCheckSameCoverImage(e.target.checked);
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
          </Box>
          <CustomInputField
            name="prefix"
            label="Titles Prefix"
            variant="filled"
            value={titlesPrefix}
            onChange={(e) =>
              setTitlesPrefix(e.target.value.replace(/[^a-zA-Z0-9\s-]/g, ''))
            }
            inputProps={{ maxLength: 180 }}
            sx={{ marginBottom: 2 }}
          />
        </>
      )}

      {publishMethod === 'files' ? (
        <Tooltip
          title="Cannot add files while videos are processing"
          disableHoverListener={!isInProcessing}
          arrow
          slotProps={{
            tooltip: {
              sx: {
                fontSize: fontSizeMedium,
              },
            },
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              border: '1px dashed gray',
              padding: 2,
              textAlign: 'center',
              marginBottom: 2,
              cursor: 'pointer',
              opacity: isInProcessing ? 0.5 : 1,
            }}
          >
            <input {...getInputProps()} disabled={isInProcessing} />
            <Typography>
              {t('core:publish.drag_drop_videos', {
                postProcess: 'capitalizeFirstChar',
              })}
            </Typography>
          </Box>
        </Tooltip>
      ) : (
        <Box sx={{ marginBottom: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <PublishSearch
              label="Find a Video"
              value={videoReference}
              setValue={setVideoReference}
              service="VIDEO"
              disabled={isInProcessing}
            />
            {(isDownloading || showDownloadComplete) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!showDownloadComplete && <CircularProgress size={24} />}
                <Typography variant="body2" sx={{ fontSize: fontSizeLarge }}>
                  {showDownloadComplete
                    ? 'Download Complete'
                    : currentPercent !== undefined
                      ? currentPercent === 100
                        ? 'Building'
                        : `${currentPercent}%`
                      : 'Downloading...'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
