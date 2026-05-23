import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiltersCheckbox,
  FiltersRow,
  FiltersSubContainer,
} from '../../../../pages/Home/Components/VideoList-styles.tsx';
import { CodecTypography, CustomInputField } from '../PublishVideo-styles.tsx';
import { UseVideoFormReturn } from '../videoFormHooks/useVideoForm';
import { UseVideoUploadReturn } from '../videoFormHooks/useVideoUpload';
import { FileLoader } from './FileLoader.tsx';

interface PublishVideoInitializerProps {
  videoForm: UseVideoFormReturn;
  videoUpload: UseVideoUploadReturn;
}

export const PublishVideoInitializer: React.FC<
  PublishVideoInitializerProps
> = ({
  videoForm: {
    isCheckTitleByFile,
    setIsCheckTitleByFile,
    isCheckSameCoverImage,
    setIsCheckSameCoverImage,
    titlesPrefix,
    setTitlesPrefix,
  },
  videoUpload: { getRootProps, getInputProps },
}) => {
  const { t } = useTranslation(['core']);

  return (
    <>
      <FiltersSubContainer>
        <FiltersRow>
          {t('core:publish.populate_titles', {
            postProcess: 'capitalizeFirstChar',
          })}
          <FiltersCheckbox
            checked={isCheckTitleByFile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsCheckTitleByFile(e.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </FiltersRow>
        <FiltersRow>
          {t('core:publish.same_cover_images', {
            postProcess: 'capitalizeFirstChar',
          })}
          <FiltersCheckbox
            checked={isCheckSameCoverImage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsCheckSameCoverImage(e.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </FiltersRow>
      </FiltersSubContainer>
      <CustomInputField
        name="prefix"
        label="Titles Prefix"
        variant="filled"
        value={titlesPrefix}
        onChange={(e) =>
          setTitlesPrefix(e.target.value.replace(/[^a-zA-Z0-9\s-]/g, ''))
        }
        inputProps={{ maxLength: 180 }}
      />
      <FileLoader getRootProps={getRootProps} getInputProps={getInputProps} />
      <Box>
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
