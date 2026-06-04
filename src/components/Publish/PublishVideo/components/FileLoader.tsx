import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { QortalGetMetadata, useResourceStatus } from 'qapp-core';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizeLarge } from '../../../../constants/Misc.ts';
import { PublishSearch } from '../../../common/PublishSearch/PublishSearch.tsx';
import { CustomInputField } from '../PublishVideo-styles.tsx';

interface FileLoaderProps {
  getRootProps: any;
  getInputProps: any;
  onValidationChange?: (isValid: boolean) => void;
  onPublishMethodChange?: (method: string) => void;
  onLinkEmptyChange?: (isEmpty: boolean) => void;
  onVideoFetch?: (videoData: any) => void;
  onSetTitle?: (title: string) => void;
  videoReference: any;
  setVideoReference: (videoReference: any) => void;
  setIsVideoDownloading: (downloading: boolean) => void;
  isCheckTitleByFile: boolean;
  setIsCheckTitleByFile: (checked: boolean) => void;
  isCheckSameCoverImage: boolean;
  setIsCheckSameCoverImage: (checked: boolean) => void;
  titlesPrefix: string;
  setTitlesPrefix: (prefix: string) => void;
  publishMethod: string;
}

export const FileLoader: React.FC<FileLoaderProps> = ({
  getRootProps,
  getInputProps,
  onValidationChange,
  onPublishMethodChange,
  onLinkEmptyChange,
  onVideoFetch,
  onSetTitle,
  videoReference,
  setVideoReference,
  setIsVideoDownloading,
  isCheckTitleByFile,
  setIsCheckTitleByFile,
  isCheckSameCoverImage,
  setIsCheckSameCoverImage,
  titlesPrefix,
  setTitlesPrefix,
  publishMethod,
}) => {
  const { t } = useTranslation(['core']);

  const [isDownloading, setIsDownloading] = useState(false);
  const [videoResource, setVideoResource] = useState<QortalGetMetadata | null>(
    null
  );
  const [currentPercent, setCurrentPercent] = useState<number | undefined>(
    undefined
  );
  const [showDownloadComplete, setShowDownloadComplete] = useState(false);
  const processedVideoRef = useRef<string | null>(null);

  // Update parent component when validation state changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!!videoReference);
    }
  }, [videoReference, onValidationChange]);

  // Update parent component when link empty state changes
  React.useEffect(() => {
    if (onLinkEmptyChange) {
      onLinkEmptyChange(!videoReference);
    }
  }, [videoReference, onLinkEmptyChange]);

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

  // Reset processed video when switching methods
  React.useEffect(() => {
    if (publishMethod === 'files') {
      processedVideoRef.current = null;
      setIsDownloading(false);
      setVideoResource(null);
      setCurrentPercent(undefined);
      setShowDownloadComplete(false);

      // Notify parent component that download has stopped
      if (setIsVideoDownloading) {
        setIsVideoDownloading(false);
      }
    }
  }, [publishMethod, setIsVideoDownloading]);

  // Track download progress
  const { isReady, percentLoaded } = useResourceStatus({
    resource: isDownloading ? videoResource : null,
    retryAttempts: 200,
  });

  const isDownloadComplete = isReady;

  // Update current percent only when percentLoaded is valid and greater than 0
  React.useEffect(() => {
    if (percentLoaded !== undefined && percentLoaded > 0) {
      setCurrentPercent(Math.floor(percentLoaded));
    }
  }, [percentLoaded]);
  // Handle video selection from PublishSearch
  const handleVideoSelect = async (selectedVideo: any) => {
    try {
      setIsDownloading(true);
      setCurrentPercent(undefined); // Reset percent for new download
      setShowDownloadComplete(false); // Reset download complete message

      // Notify parent component that download is starting
      if (setIsVideoDownloading) {
        setIsVideoDownloading(true);
      }

      // Set video resource for download tracking
      setVideoResource({
        name: selectedVideo.name,
        identifier: selectedVideo.identifier,
        service: selectedVideo.service,
      });

      // Set the title and filename immediately when video is selected
      if (selectedVideo.metadata?.title && onSetTitle) {
        onSetTitle(selectedVideo.metadata.title);
      } else if (selectedVideo.title && onSetTitle) {
        // Fallback to title if metadata.title is not available
        onSetTitle(selectedVideo.title);
      } else if (selectedVideo.name && onSetTitle) {
        // Final fallback to name if neither metadata.title nor title is available
        onSetTitle(selectedVideo.name);
      }

      // Notify parent component
      if (onVideoFetch) {
        onVideoFetch(selectedVideo);
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      setIsDownloading(false);
      setCurrentPercent(undefined);
      setShowDownloadComplete(false);
      processedVideoRef.current = null; // Reset on error to allow retry

      // Notify parent component that download has stopped
      if (setIsVideoDownloading) {
        setIsVideoDownloading(false);
      }
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
      processedVideoRef.current = null; // Reset to allow re-selection if needed

      // Notify parent component that download has completed
      if (setIsVideoDownloading) {
        setIsVideoDownloading(false);
      }
    }
  }, [isDownloadComplete, isDownloading, setIsVideoDownloading]);

  return (
    <>
      <Box sx={{ display: 'flex', marginBottom: 2 }}>
        <RadioGroup
          value={publishMethod}
          onChange={(e) => {
            const newMethod = e.target.value;
            if (onPublishMethodChange) {
              onPublishMethodChange(newMethod);
            }
          }}
          row
        >
          <FormControlLabel
            value="files"
            control={<Radio />}
            label="Publish Video Files"
          />
          <FormControlLabel
            value="qortal"
            control={<Radio />}
            label="Publish Video Reference"
          />
        </RadioGroup>
      </Box>

      {/* Show these options only when RB1 (files) is selected */}
      {publishMethod === 'files' && (
        <>
          <Box sx={{ marginBottom: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 1,
              }}
            >
              <Typography>
                {t('core:publish.populate_titles', {
                  postProcess: 'capitalizeFirstChar',
                })}
              </Typography>
              <Checkbox
                checked={isCheckTitleByFile}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIsCheckTitleByFile(e.target.checked);
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
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
        <Box
          {...getRootProps()}
          sx={{
            border: '1px dashed gray',
            padding: 2,
            textAlign: 'center',
            marginBottom: 2,
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            {t('core:publish.drag_drop_videos', {
              postProcess: 'capitalizeFirstChar',
            })}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ marginBottom: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <PublishSearch
              label="Find a Video"
              value={videoReference}
              setValue={setVideoReference}
              service="VIDEO"
            />
            {(isDownloading || showDownloadComplete) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!showDownloadComplete && <CircularProgress size={24} />}
                <Typography variant="body2" sx={{ fontSize: fontSizeLarge }}>
                  {showDownloadComplete
                    ? 'Download Complete'
                    : currentPercent !== undefined
                      ? `${currentPercent}%`
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
