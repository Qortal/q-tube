import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FileLoaderProps {
  getRootProps: any;
  getInputProps: any;
}

export const FileLoader: React.FC<FileLoaderProps> = ({
  getRootProps,
  getInputProps,
}) => {
  const { t } = useTranslation(['core']);

  return (
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
  );
};