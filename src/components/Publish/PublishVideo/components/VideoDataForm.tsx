import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FrameExtractor } from '../../../common/FrameExtractor/FrameExtractor.tsx';
import ImageUploader from '../../../common/ImageUploader.tsx';
import { TextEditor } from '../../../common/TextEditor/TextEditor.tsx';
import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CustomInputField,
  LogoPreviewRow,
  TimesIcon,
} from '../PublishVideo-styles.tsx';
import { UseVideoFormReturn } from '../videoFormHooks/useVideoForm';
import { UseVideoUploadReturn } from '../videoFormHooks/useVideoUpload';
import { CategorySelect } from './CategorySelect.tsx';

interface VideoDataProps {
  videoForm: UseVideoFormReturn;
  videoUpload: UseVideoUploadReturn;
}

export const VideoDataForm: React.FC<VideoDataProps> = ({
  videoForm: {
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    setSelectedCategoryVideos,
    setSelectedSubCategoryVideos,
    isCheckSameCoverImage,
    coverImageForAll,
    setCoverImageForAll,
    handleOnchange,
  },
  videoUpload: {
    files,
    videoDurations,
    setVideoDurations,
    assembleVideoDurations,
    onFramesExtracted,
    setFiles,
  },
}) => {
  const { t } = useTranslation(['core', 'category']);
  const theme = useTheme();

  // Call assembleVideoDurations in useEffect to avoid state update during render
  useEffect(() => {
    assembleVideoDurations();
  }, [files.length, videoDurations.length, assembleVideoDurations]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {files?.length > 0 && (
          <CategorySelect
            selectedCategory={selectedCategoryVideos}
            selectedSubCategory={selectedSubCategoryVideos}
            setSelectedCategory={setSelectedCategoryVideos}
            setSelectedSubCategory={setSelectedSubCategoryVideos}
          />
        )}
      </Box>
      {files?.length > 0 && isCheckSameCoverImage && (
        <>
          {!coverImageForAll ? (
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
                ></AddLogoIcon>
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
              ></TimesIcon>
            </LogoPreviewRow>
          )}
        </>
      )}
      {files.map((file, index) => {
        return (
          <React.Fragment key={index}>
            <FrameExtractor
              videoFile={file.file}
              onFramesExtracted={async (imgs) => onFramesExtracted(imgs, index)}
              videoDurations={videoDurations}
              setVideoDurations={setVideoDurations}
              index={index}
            />
            <Typography>{file?.file?.name}</Typography>
            {!isCheckSameCoverImage && (
              <>
                {!file?.coverImage ? (
                  <ImageUploader
                    onPick={(img: string) =>
                      handleOnchange(index, 'coverImage', img, setFiles)
                    }
                  >
                    <AddCoverImageButton variant="contained">
                      {t('core:publish.add_cover_image', {
                        postProcess: 'capitalizeEachFirstChar',
                      })}
                      <AddLogoIcon
                        sx={{
                          height: '25px',
                          width: 'auto',
                        }}
                      ></AddLogoIcon>
                    </AddCoverImageButton>
                  </ImageUploader>
                ) : (
                  <LogoPreviewRow>
                    <CoverImagePreview src={file?.coverImage} alt="logo" />
                    <TimesIcon
                      color={theme.palette.text.primary}
                      onClickFunc={() =>
                        handleOnchange(index, 'coverImage', '', setFiles)
                      }
                      height={'32'}
                      width={'32'}
                    ></TimesIcon>
                  </LogoPreviewRow>
                )}
              </>
            )}

            <CustomInputField
              name="title"
              label="Title of video"
              variant="filled"
              value={file.title}
              onChange={(e) =>
                handleOnchange(index, 'title', e.target.value, setFiles)
              }
              inputProps={{ maxLength: 180 }}
              required
            />
            <Typography
              sx={{
                fontSize: '18px',
              }}
            >
              {t('core:publish.description_video', {
                postProcess: 'capitalizeEachFirstChar',
              })}
            </Typography>
            <TextEditor
              inlineContent={file?.description}
              setInlineContent={(value) => {
                handleOnchange(index, 'description', value, setFiles);
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
