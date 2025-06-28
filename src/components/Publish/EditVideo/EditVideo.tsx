import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { Signal, useSignal, useSignalEffect } from '@preact/signals-react';
import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import ShortUniqueId from 'short-unique-id';
import { categories, subCategories } from '../../../constants/Categories.ts';
import { QTUBE_VIDEO_BASE } from '../../../constants/Identifiers.ts';
import {
  maxSize,
  titleFormatter,
  videoMaxSize,
} from '../../../constants/Misc.ts';

import {
  setEditVideo,
  updateInHashMap,
  updateVideo,
} from '../../../state/features/videoSlice.ts';
import { RootState } from '../../../state/store.ts';
import BoundedNumericTextField from '../../../utils/BoundedNumericTextField.tsx';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import { FrameExtractor } from '../../common/FrameExtractor/FrameExtractor.tsx';
import ImageUploader from '../../common/ImageUploader.tsx';
import { TextEditor } from '../../common/TextEditor/TextEditor.tsx';
import { extractTextFromHTML } from '../../common/TextEditor/utils.ts';
import { MultiplePublish } from '../MultiplePublish/MultiplePublishAll.tsx';
import { toBase64 } from '../PublishVideo/PublishVideo.tsx';

import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  CustomInputField,
  LogoPreviewRow,
  ModalBody,
  NewCrowdfundTitle,
  TimesIcon,
} from './EditVideo-styles.tsx';
import { useAuth, usePublish } from 'qapp-core';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';

export const EditVideo = () => {
  const theme = useTheme();
  const setNotification = useSetAtom(setNotificationAtom);

  const dispatch = useDispatch();
  const { name: username, address: userAddress } = useAuth();

  const editVideoProperties = useSelector(
    (state: RootState) => state.video.editVideoProperties
  );
  const [publishes, setPublishes] = useState<any>(null);
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [videoPropertiesToSetToRedux, setVideoPropertiesToSetToRedux] =
    useState(null);
  const publishFromLibrary = usePublish();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [file, setFile] = useState(null);
  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);
  const [imageExtracts, setImageExtracts] = useState<any>([]);

  const videoDuration: Signal<number[]> = useSignal([
    editVideoProperties?.duration || 0,
  ]);

  useEffect(() => {
    videoDuration.value[0] = Math.floor(editVideoProperties?.duration);
  }, [editVideoProperties]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': [],
    },
    maxFiles: 1,
    maxSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      const firstFile = acceptedFiles[0];

      setFile(firstFile);

      let errorString = null;

      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            errorString = `File must be under ${videoMaxSize}MB`;
          }
          console.error(`Error with file ${file.name}: ${error.message}`);
        });
      });
      if (errorString) {
        const notificationObj: AltertObject = {
          msg: errorString,
          alertType: 'error',
        };
        setNotification(notificationObj);
      }
    },
  });

  useEffect(() => {
    if (editVideoProperties) {
      setTitle(editVideoProperties?.title || '');
      if (editVideoProperties?.htmlDescription) {
        setDescription(editVideoProperties?.htmlDescription);
      } else if (editVideoProperties?.fullDescription) {
        const paragraph = `<p>${editVideoProperties?.fullDescription}</p>`;
        setDescription(paragraph);
      }
      setCoverImage(editVideoProperties?.videoImage || '');

      if (editVideoProperties?.category) {
        const selectedOption = categories.find(
          (option) => option.id === +editVideoProperties.category
        );
        setSelectedCategoryVideos(selectedOption || null);
      }

      if (
        editVideoProperties?.category &&
        editVideoProperties?.subcategory &&
        subCategories[+editVideoProperties?.category]
      ) {
        const selectedOption = subCategories[
          +editVideoProperties?.category
        ]?.find((option) => option.id === +editVideoProperties.subcategory);
        setSelectedSubCategoryVideos(selectedOption || null);
      }
    }
  }, [editVideoProperties]);

  const onClose = () => {
    dispatch(setEditVideo(null));
    setVideoPropertiesToSetToRedux(null);
    setFile(null);
    setTitle('');
    setImageExtracts([]);
    setDescription('');
    setCoverImage('');
  };

  async function publishQDNResource() {
    try {
      if (!title) throw new Error('Please enter a title');
      if (!description) throw new Error('Please enter a description');
      if (!coverImage) throw new Error('Please select cover image');
      if (!selectedCategoryVideos) throw new Error('Please select a category');
      if (!editVideoProperties) return;
      if (!userAddress) throw new Error('Unable to locate user address');
      let errorMsg = '';
      let name = '';
      if (username) {
        name = username;
      }
      if (!name) {
        errorMsg =
          'Cannot publish without access to your name. Please authenticate.';
      }

      if (editVideoProperties?.user !== username) {
        errorMsg = "Cannot publish another user's resource";
      }

      if (errorMsg) {
        const notificationObj: AltertObject = {
          msg: errorMsg,
          alertType: 'error',
        };
        setNotification(notificationObj);
        return;
      }
      const listOfPublishes = [];
      const category = selectedCategoryVideos.id;
      const subcategory = selectedSubCategoryVideos?.id || '';

      const fullDescription = extractTextFromHTML(description);
      let fileExtension = 'mp4';
      const fileExtensionSplit = file?.name?.split('.');
      if (fileExtensionSplit?.length > 1) {
        fileExtension = fileExtensionSplit?.pop() || 'mp4';
      }

      const filename = title.slice(0, 15);
      // Step 1: Replace all white spaces with underscores

      // Replace all forms of whitespace (including non-standard ones) with underscores
      const stringWithUnderscores = filename.replace(/[\s\uFEFF\xA0]+/g, '_');

      // Remove all non-alphanumeric characters (except underscores)
      const alphanumericString = stringWithUnderscores.replace(
        /[^a-zA-Z0-9_]/g,
        ''
      );

      const videoObject: any = {
        title,
        version: editVideoProperties.version,
        htmlDescription: description,
        fullDescription,
        videoImage: coverImage,
        videoReference: editVideoProperties.videoReference,
        extracts: file ? imageExtracts : editVideoProperties?.extracts,
        commentsId: editVideoProperties.commentsId,
        category,
        subcategory,
        code: editVideoProperties.code,
        videoType: file?.type || 'video/mp4',
        filename: `${alphanumericString.trim()}.${fileExtension}`,
        fileSize: file?.size || 0,
        duration: videoDuration.value[0] || editVideoProperties?.duration || 0,
      };
      const metadescription =
        `**category:${category};subcategory:${subcategory};code:${editVideoProperties.code}**` +
        description.slice(0, 150);

      // Description is obtained from raw data
      const requestBodyJson: any = {
        action: 'PUBLISH_QDN_RESOURCE',
        name: username,
        service: 'DOCUMENT',
        data64: await objectToBase64(videoObject),
        title: title.slice(0, 50),
        description: metadescription,
        identifier: editVideoProperties.id,
        tag1: QTUBE_VIDEO_BASE,
        filename: `video_metadata.json`,
      };
      listOfPublishes.push(requestBodyJson);

      if (file && editVideoProperties.videoReference?.identifier) {
        const requestBodyVideo: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: username,
          service: 'VIDEO',
          file,
          title: title.slice(0, 50),
          description: metadescription,
          identifier: editVideoProperties.videoReference?.identifier,
          tag1: QTUBE_VIDEO_BASE,
          filename: `${alphanumericString.trim()}.${fileExtension}`,
        };
        listOfPublishes.push(requestBodyVideo);
      }

      setVideoPropertiesToSetToRedux({
        ...editVideoProperties,
        ...videoObject,
      });

      await publishFromLibrary.publishMultipleResources(listOfPublishes);
      const clonedCopy = structuredClone({
        ...editVideoProperties,
        ...videoObject,
      });
      dispatch(updateVideo(clonedCopy));
      dispatch(updateInHashMap(clonedCopy));
      const notificationObj: AltertObject = {
        msg: 'Video updated',
        alertType: 'success',
      };
      setNotification(notificationObj);

      onClose();
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Failed to publish update';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);
      throw new Error('Failed to publish update');
    }
  }

  const handleOptionCategoryChangeVideos = (
    event: SelectChangeEvent<string>
  ) => {
    const optionId = event.target.value;
    const selectedOption = categories.find((option) => option.id === +optionId);
    setSelectedCategoryVideos(selectedOption || null);
  };
  const handleOptionSubCategoryChangeVideos = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      (option) => option.id === +optionId
    );
    setSelectedSubCategoryVideos(selectedOption || null);
  };

  const onFramesExtracted = async (imgs) => {
    try {
      const imagesExtracts = [];

      for (const img of imgs) {
        try {
          let compressedFile;
          const image = img;
          await new Promise<void>((resolve) => {
            new Compressor(image, {
              quality: 0.8,
              maxWidth: 750,
              mimeType: 'image/webp',
              success(result) {
                const file = new File([result], 'name', {
                  type: 'image/webp',
                });
                compressedFile = file;
                resolve();
              },
              error(error) {
                console.error(error);
              },
            });
          });
          if (!compressedFile) continue;
          const base64Img = await toBase64(compressedFile);
          imagesExtracts.push(base64Img);
        } catch (error) {
          console.error(error);
        }
      }

      setImageExtracts(imagesExtracts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        open={!!editVideoProperties}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalBody sx={{ maxHeight: '98vh' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <NewCrowdfundTitle>Update Video properties</NewCrowdfundTitle>
          </Box>
          <>
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
              <Typography>Click to update video file - optional</Typography>
            </Box>
            <Typography
              sx={{
                marginBottom: '10px',
              }}
            >
              {file?.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="Category">Select a Category</InputLabel>
                <Select
                  labelId="Category"
                  input={<OutlinedInput label="Select a Category" />}
                  value={selectedCategoryVideos?.id || ''}
                  onChange={handleOptionCategoryChangeVideos}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedCategoryVideos &&
                subCategories[selectedCategoryVideos?.id] && (
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="Category">Select a Sub-Category</InputLabel>
                    <Select
                      labelId="Sub-Category"
                      input={<OutlinedInput label="Select a Sub-Category" />}
                      value={selectedSubCategoryVideos?.id || ''}
                      onChange={(e) =>
                        handleOptionSubCategoryChangeVideos(
                          e,
                          subCategories[selectedCategoryVideos?.id]
                        )
                      }
                    >
                      {subCategories[selectedCategoryVideos.id].map(
                        (option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
            </Box>
            {file && (
              <FrameExtractor
                videoFile={file}
                onFramesExtracted={(imgs) => onFramesExtracted(imgs)}
                videoDurations={videoDuration}
                index={0}
              />
            )}
            <React.Fragment>
              {!coverImage ? (
                <ImageUploader onPick={(img: string) => setCoverImage(img)}>
                  <AddCoverImageButton variant="contained">
                    Add Cover Image
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
                  <CoverImagePreview src={coverImage} alt="logo" />
                  <TimesIcon
                    color={theme.palette.text.primary}
                    onClickFunc={() => setCoverImage('')}
                    height={'32'}
                    width={'32'}
                  ></TimesIcon>
                </LogoPreviewRow>
              )}
              <BoundedNumericTextField
                minValue={1}
                maxValue={Number.MAX_SAFE_INTEGER}
                label="Video Duration in Seconds"
                addIconButtons={false}
                allowDecimals={false}
                initialValue={videoDuration.value[0].toString()}
                afterChange={(s) => {
                  videoDuration.value[0] = +s;
                }}
              />
              <CustomInputField
                name="title"
                label="Title of video"
                variant="filled"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.replace(titleFormatter, '');
                  setTitle(formattedValue);
                }}
                inputProps={{ maxLength: 180 }}
                required
              />
              <Typography
                sx={{
                  fontSize: '18px',
                }}
              >
                Description of video
              </Typography>
              <TextEditor
                inlineContent={description}
                setInlineContent={(value) => {
                  setDescription(value);
                }}
              />
            </React.Fragment>
          </>

          <CrowdfundActionButtonRow>
            <CrowdfundActionButton
              onClick={() => {
                onClose();
              }}
              variant="contained"
              color="error"
            >
              Cancel
            </CrowdfundActionButton>
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <CrowdfundActionButton
                variant="contained"
                onClick={() => {
                  publishQDNResource();
                }}
                disabled={file && imageExtracts.length === 0}
              >
                {file && imageExtracts.length === 0 && (
                  <CircularProgress color="secondary" size={14} />
                )}
                Publish
              </CrowdfundActionButton>
            </Box>
          </CrowdfundActionButtonRow>
        </ModalBody>
      </Modal>
    </>
  );
};
