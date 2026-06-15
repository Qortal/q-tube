import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploader from '../../../common/ImageUploader.tsx';
import { TextEditor } from '../../../common/TextEditor/TextEditor.tsx';
import { formatTime } from '../../../../utils/numberFunctions';
import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CustomInputField,
  LogoPreviewRow,
  TimesIcon,
} from '../PublishVideo-styles.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';
import { CategorySelect } from './CategorySelect.tsx';

// Shared Category Selection Component
export const VideoCategorySelection: React.FC = () => {
  const workflow = usePublishVideo();
  const {
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    setSelectedCategoryVideos,
    setSelectedSubCategoryVideos,
  } = workflow;

  return (
    <CategorySelect
      selectedCategory={selectedCategoryVideos}
      selectedSubCategory={selectedSubCategoryVideos}
      setSelectedCategory={setSelectedCategoryVideos}
      setSelectedSubCategory={setSelectedSubCategoryVideos}
    />
  );
};

// Shared Cover Image Component for individual videos
export const VideoCoverImage: React.FC<{
  coverImage: string;
  onCoverImageChange: (image: string) => void;
}> = ({ coverImage, onCoverImageChange }) => {
  const { t } = useTranslation(['core']);
  const theme = useTheme();

  return !coverImage ? (
    <ImageUploader onPick={onCoverImageChange}>
      <AddCoverImageButton variant="contained">
        {t('core:publish.add_cover_image', {
          postProcess: 'capitalizeEachFirstChar',
        })}
        <AddLogoIcon
          sx={{
            height: '25px',
            width: 'auto',
          }}
        />
      </AddCoverImageButton>
    </ImageUploader>
  ) : (
    <LogoPreviewRow>
      <CoverImagePreview src={coverImage} alt="logo" />
      <TimesIcon
        color={theme.palette.text.primary}
        onClickFunc={() => onCoverImageChange('')}
        height={'32'}
        width={'32'}
      />
    </LogoPreviewRow>
  );
};

// Shared Cover Image Component for all videos
export const VideoCoverImageForAll: React.FC = () => {
  const { t } = useTranslation(['core']);
  const theme = useTheme();
  const workflow = usePublishVideo();
  const { coverImageForAll, setCoverImageForAll } = workflow;

  return !coverImageForAll ? (
    <ImageUploader onPick={(img: string) => setCoverImageForAll(img)}>
      <AddCoverImageButton variant="contained">
        {t('core:publish.add_cover_image', {
          postProcess: 'capitalizeEachFirstChar',
        })}
        <AddLogoIcon
          sx={{
            height: '25px',
            width: 'auto',
          }}
        />
      </AddCoverImageButton>
    </ImageUploader>
  ) : (
    <LogoPreviewRow>
      <CoverImagePreview src={coverImageForAll} alt="logo" />
      <TimesIcon
        color={theme.palette.text.primary}
        onClickFunc={() => setCoverImageForAll(null)}
        height={'32'}
        width={'32'}
      />
    </LogoPreviewRow>
  );
};

// Shared Title Input Component
export const VideoTitleInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <CustomInputField
      name="title"
      label="Title of video"
      variant="filled"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{ maxLength: 180 }}
      required
    />
  );
};

// Shared Description Editor Component
export const VideoDescriptionEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation(['core']);

  return (
    <>
      <Typography
        sx={{
          fontSize: '18px',
        }}
      >
        {t('core:publish.description_video', {
          postProcess: 'capitalizeFirstChar',
        })}
      </Typography>
      <TextEditor inlineContent={value} setInlineContent={onChange} />
    </>
  );
};

// Shared Video Filename Display Component
export const VideoFilenameDisplay: React.FC<{
  filename: string;
  fileExtension?: string;
}> = ({ filename, fileExtension }) => {
  return (
    <Typography>
      {filename}
      {fileExtension || ''}
    </Typography>
  );
};

// Shared Video Duration Display Component
export const VideoDurationDisplay: React.FC<{
  duration: number;
}> = ({ duration }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        mt: 1,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Duration: {duration > 0 ? formatTime(duration) : <CircularProgress size={14} />}
      </Typography>
    </Box>
  );
};
