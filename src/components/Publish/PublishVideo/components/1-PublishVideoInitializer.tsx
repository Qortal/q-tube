import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CodecTypography } from '../PublishVideo-styles.tsx';
import { FileLoader } from './FileLoader.tsx';

export const PublishVideoInitializer: React.FC = () => {
  const { t } = useTranslation(['core']);

  return (
    <>
      <FileLoader />
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
