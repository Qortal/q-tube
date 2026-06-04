import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CodecTypography } from '../PublishVideo-styles.tsx';
import { UseVideoPublishingWorkflowReturn } from '../videoFormHooks/useVideoPublishingWorkflow';
import { FileLoader } from './FileLoader.tsx';

interface PublishVideoInitializerProps {
  videoForm: UseVideoPublishingWorkflowReturn;
  videoUpload: UseVideoPublishingWorkflowReturn;
  isCheckTitleByFile: boolean;
  setIsCheckTitleByFile: (value: boolean) => void;
  isCheckSameCoverImage: boolean;
  setIsCheckSameCoverImage: (value: boolean) => void;
  titlesPrefix: string;
  setTitlesPrefix: (value: string) => void;
  publishMethod: string;
}

export const PublishVideoInitializer: React.FC<
  PublishVideoInitializerProps
> = ({
  videoForm: {
    setIsValidQortalLink,
    setPublishMethod,
    setIsQortalLinkEmpty,
    setFetchedVideoData,
    setVideoTitle,
    videoReference,
    setVideoReference,
    setIsVideoDownloading,
    publishMethod,
  },
  videoUpload: { getRootProps, getInputProps },
  isCheckTitleByFile,
  setIsCheckTitleByFile,
  isCheckSameCoverImage,
  setIsCheckSameCoverImage,
  titlesPrefix,
  setTitlesPrefix,
}) => {
  const { t } = useTranslation(['core']);

  return (
    <>
      <FileLoader
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        onValidationChange={setIsValidQortalLink}
        onPublishMethodChange={setPublishMethod}
        onLinkEmptyChange={setIsQortalLinkEmpty}
        onVideoFetch={setFetchedVideoData}
        onSetTitle={setVideoTitle}
        videoReference={videoReference}
        setVideoReference={setVideoReference}
        setIsVideoDownloading={setIsVideoDownloading}
        isCheckTitleByFile={isCheckTitleByFile}
        setIsCheckTitleByFile={setIsCheckTitleByFile}
        isCheckSameCoverImage={isCheckSameCoverImage}
        setIsCheckSameCoverImage={setIsCheckSameCoverImage}
        titlesPrefix={titlesPrefix}
        setTitlesPrefix={setTitlesPrefix}
        publishMethod={publishMethod}
      />
      <Box sx={{ marginTop: 2 }}>
        <CodecTypography>
          {t('core:publish.supported_containers', {
            postProcess: 'capitalizeFirstChar',
          })}
          : <span style={{ fontWeight: 'bold' }}>MP4</span>, M4V, OGG, WEBM, WAV
        </CodecTypography>
        <CodecTypography>
          {t('core:publish.audio_codecs', {
            postProcess: 'capitalizeEachFirstChar',
          })}
          : <span style={{ fontWeight: 'bold' }}>Opus</span>, MP3, FLAC, PCM
          (8/16/32-bit, μ-law), Vorbis
        </CodecTypography>
        <CodecTypography>
          {t('core:publish.video_codecs', {
            postProcess: 'capitalizeEachFirstChar',
          })}
          : <span style={{ fontWeight: 'bold' }}>AV1</span>, VP8, VP9, H.264
        </CodecTypography>
      </Box>
    </>
  );
};
