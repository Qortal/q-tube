import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';

import Compressor from 'compressorjs';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ShortUniqueId from 'short-unique-id';
import { categories, subCategories } from '../../../constants/Categories.ts';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../../constants/Identifiers.ts';
import {
  maxSize,
  menuIconSize,
  titleFormatter,
  videoMaxSize,
} from '../../../constants/Misc.ts';
import {
  FiltersCheckbox,
  FiltersRow,
  FiltersSubContainer,
} from '../../../pages/Home/Components/VideoList-styles.tsx';

import { getFileName } from '../../../utils/stringFunctions.ts';
import { CardContentContainerComment } from '../../common/Comments/Comments-styles.tsx';
import { FrameExtractor } from '../../common/FrameExtractor/FrameExtractor.tsx';

import ImageUploader from '../../common/ImageUploader.tsx';
import { TextEditor } from '../../common/TextEditor/TextEditor.tsx';
import { extractTextFromHTML } from '../../common/TextEditor/utils.ts';
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from '../EditPlaylist/Upload-styles.tsx';
import { MultiplePublish } from '../MultiplePublish/MultiplePublishAll.tsx';
import {
  AddCoverImageButton,
  AddLogoIcon,
  CodecTypography,
  CoverImagePreview,
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  CustomInputField,
  LogoPreviewRow,
  ModalBody,
  NewCrowdfundTitle,
  StyledButton,
  TimesIcon,
} from './PublishVideo-styles.tsx';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { objectToBase64, useAuth, useGlobal, usePublish } from 'qapp-core';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import { useTranslation } from 'react-i18next';

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => {
      reject(error);
    };
  });

const uid = new ShortUniqueId();
const shortuid = new ShortUniqueId({ length: 5 });

interface PublishVideoProps {
  editId?: string;
  editContent?: null | {
    title: string;
    user: string;
    coverImage: string | null;
  };
  afterClose?: () => void;
}

interface VideoFile {
  file: File;
  title: string;
  description: string;
  coverImage?: string;
}
export const PublishVideo = ({
  editId,
  editContent,
  afterClose,
}: PublishVideoProps) => {
  const { t } = useTranslation(['core', 'category']);

  const theme = useTheme();
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const setNotification = useSetAtom(setNotificationAtom);
  const { lists } = useGlobal();
  const { name: username, address: userAddress } = useAuth();

  const [files, setFiles] = useState<VideoFile[]>([]);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coverImageForAll, setCoverImageForAll] = useState<null | string>('');

  const [step, setStep] = useState<string>('videos');
  const [playlistCoverImage, setPlaylistCoverImage] = useState<null | string>(
    null
  );
  const [selectExistingPlaylist, setSelectExistingPlaylist] =
    useState<any>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [titlesPrefix, setTitlesPrefix] = useState('');
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [playlistDescription, setPlaylistDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);

  const [playlistSetting, setPlaylistSetting] = useState<null | string>(null);
  const [publishes, setPublishes] = useState<any>(null);
  const [isCheckTitleByFile, setIsCheckTitleByFile] = useState(true);
  const [isCheckSameCoverImage, setIsCheckSameCoverImage] = useState(true);
  const [isCheckDescriptionIsTitle, setIsCheckDescriptionIsTitle] =
    useState(false);
  const [imageExtracts, setImageExtracts] = useState<any>({});
  const publishFromLibrary = usePublish();

  const assembleVideoDurations = () => {
    if (files.length === videoDurations.length) return;
    const newArray: number[] = [];

    files.map((file, index) =>
      newArray.push(videoDurations[index] ? videoDurations[index] : 0)
    );
    setVideoDurations([...newArray]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': [],
    },
    maxSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      const formatArray = acceptedFiles.map((item) => {
        let filteredTitle = '';

        if (isCheckTitleByFile) {
          const fileName = getFileName(item?.name || '');
          filteredTitle = (titlesPrefix + fileName).replace(titleFormatter, '');
        }
        return {
          file: item,
          title: filteredTitle || '',
          description: '',
          coverImage: '',
        };
      });

      setFiles((prev) => [...prev, ...formatArray]);

      let errorString: string | null = null;
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

  const onClose = () => {
    setIsOpen(false);
    if (afterClose) afterClose();
  };

  const search = async () => {
    const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&mode=ALL&identifier=${QTUBE_PLAYLIST_BASE}&title=${filterSearch}&limit=20&includemetadata=true&reverse=true&name=${username}&exactmatchnames=true&offset=0`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseDataSearchVid = await response.json();
    setSearchResults(responseDataSearchVid);
  };

  async function publishQDNResource() {
    try {
      if (playlistSetting === 'new') {
        if (!playlistTitle) throw new Error('Please enter a title');
        if (!playlistDescription) throw new Error('Please enter a description');
        if (!playlistCoverImage) throw new Error('Please select cover image');
        if (!selectedCategory) throw new Error('Please select a category');
      }
      if (files?.length === 0)
        throw new Error('Please select at least one file');
      if (isCheckSameCoverImage && !coverImageForAll)
        throw new Error('Please select cover image');
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

      if (editId && editContent?.user !== name) {
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

      const listOfPublishes: any[] = [];

      const tempResourcesForList: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const publish = files[i];
        const title = publish.title;
        const description = isCheckDescriptionIsTitle
          ? publish.title
          : publish.description;
        const category = selectedCategoryVideos.id;
        const subcategory = selectedSubCategoryVideos?.id || '';
        const coverImage = isCheckSameCoverImage
          ? coverImageForAll
          : publish.coverImage;
        const file = publish.file;
        const sanitizeTitle = title
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .toLowerCase();

        const id = uid.rnd();

        const identifier = editId
          ? editId
          : `${QTUBE_VIDEO_BASE}${sanitizeTitle.slice(0, 30)}_${id}`;

        const code = shortuid.rnd();
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
          version: 1,
          fullDescription,
          htmlDescription: description,
          videoImage: coverImage,
          videoReference: {
            name,
            identifier: identifier,
            service: 'VIDEO',
          },
          extracts: imageExtracts[i],
          commentsId: `${QTUBE_VIDEO_BASE}_cm_${id}`,
          category,
          subcategory,
          code,
          videoType: file?.type || 'video/mp4',
          filename: `${alphanumericString.trim()}.${fileExtension}`,
          fileSize: file?.size || 0,
          duration: videoDurations[i],
        };

        const metadescription =
          `**category:${category};subcategory:${subcategory};code:${code}**` +
          fullDescription.slice(0, 150);

        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: name,
          service: 'DOCUMENT',
          data64: await objectToBase64(videoObject),
          title: title.slice(0, 50),
          description: metadescription,
          identifier: identifier + '_metadata',
          tag1: QTUBE_VIDEO_BASE,
          filename: `video_metadata.json`,
          code,
        };
        const requestBodyVideo: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: name,
          service: 'VIDEO',
          file,
          title: title.slice(0, 50),
          description: metadescription,
          identifier,
          filename: `${alphanumericString.trim()}.${fileExtension}`,
          tag1: QTUBE_VIDEO_BASE,
        };
        listOfPublishes.push(requestBodyJson);
        listOfPublishes.push(requestBodyVideo);
        tempResourcesForList.push({
          qortalMetadata: {
            identifier,
            name: name,
            service: 'DOCUMENT',
            size: 1000,
            created: Date.now(),
          },
          data: videoObject,
        });
      }

      const isNewPlaylist = playlistSetting === 'new';

      if (isNewPlaylist) {
        const title = playlistTitle;
        const description = playlistDescription;
        const stringDescription = extractTextFromHTML(description);
        const category = selectedCategory.id;
        const subcategory = selectedSubCategory?.id || '';
        const coverImage = playlistCoverImage;
        const sanitizeTitle = title
          .replace(/[^a-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .toLowerCase();

        const id = uid.rnd();

        const identifier = editId
          ? editId
          : `${QTUBE_PLAYLIST_BASE}${sanitizeTitle.slice(0, 30)}_${id}`;

        const videos = listOfPublishes
          .filter(
            (item) =>
              item.service === 'DOCUMENT' && item.tag1 === QTUBE_VIDEO_BASE
          )
          .map((vid) => {
            return {
              identifier: vid.identifier,
              service: vid.service,
              name: vid.name,
              code: vid.code,
            };
          });

        const playlistObject: any = {
          title,
          version: 1,
          description: stringDescription,
          htmlDescription: description,
          image: coverImage,
          videos,
          commentsId: `${QTUBE_PLAYLIST_BASE}_cm_${id}`,
          category,
          subcategory,
        };

        const codes = videos
          .map((item) => `c:${item.code};`)
          .slice(0, 10)
          .join('');

        const metadescription =
          `**category:${category};subcategory:${subcategory};${codes}**` +
          stringDescription.slice(0, 120);

        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: name,
          service: 'PLAYLIST',
          data64: await objectToBase64(playlistObject),
          title: title.slice(0, 50),
          description: metadescription,
          identifier: identifier + '_metadata',
          tag1: QTUBE_VIDEO_BASE,
        };

        listOfPublishes.push(requestBodyJson);
      } else if (playlistSetting === 'existing') {
        if (!selectExistingPlaylist) {
          throw new Error('select a playlist');
        }

        // get raw data for playlist
        const responseData = await qortalRequest({
          action: 'FETCH_QDN_RESOURCE',
          name: selectExistingPlaylist.name,
          service: selectExistingPlaylist.service,
          identifier: selectExistingPlaylist.identifier,
        });
        if (responseData && !responseData.error) {
          const videos = listOfPublishes
            .filter(
              (item) =>
                item.service === 'DOCUMENT' && item.tag1 === QTUBE_VIDEO_BASE
            )
            .map((vid) => {
              return {
                identifier: vid.identifier,
                service: vid.service,
                name: vid.name,
                code: vid.code,
              };
            });

          const videosInPlaylist = [...responseData.videos, ...videos];
          const playlistObject: any = {
            ...responseData,
            videos: videosInPlaylist,
          };
          const codes = videosInPlaylist
            .map((item) => `c:${item.code};`)
            .slice(0, 10)
            .join('');

          const metadescription =
            `**category:${playlistObject.category};subcategory:${playlistObject.subcategory};${codes}**` +
            playlistObject.description.slice(0, 120);

          // Description is obtained from raw data
          const requestBodyJson: any = {
            action: 'PUBLISH_QDN_RESOURCE',
            name: name,
            service: 'PLAYLIST',
            data64: await objectToBase64(playlistObject),
            title: playlistObject.title.slice(0, 50),
            description: metadescription,
            identifier: selectExistingPlaylist.identifier,
            tag1: QTUBE_VIDEO_BASE,
          };

          listOfPublishes.push(requestBodyJson);
        } else {
          throw new Error('cannot get playlist data');
        }
      }

      await publishFromLibrary.publishMultipleResources(listOfPublishes);
      lists.addNewResources('AllVideos', tempResourcesForList);
      const notificationObj: AltertObject = {
        msg: 'Video published',
        alertType: 'success',
      };
      setNotification(notificationObj);
      onClose();
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Failed to publish video';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);

      throw new Error('Failed to publish video');
    }
  }

  const handleOnchange = (index: number, type: string, value: string) => {
    setFiles((prev) => {
      let formattedValue = value;
      if (type === 'title') {
        formattedValue = value.replace(titleFormatter, '');
      }
      const copyFiles = [...prev];
      copyFiles[index] = {
        ...copyFiles[index],
        [type]: formattedValue,
      };
      return copyFiles;
    });
  };

  const handleOptionCategoryChange = (event: SelectChangeEvent<string>) => {
    const optionId = event.target.value;
    const selectedOption = categories.find((option) => option.id === +optionId);
    setSelectedCategory(selectedOption || null);
  };
  const handleOptionSubCategoryChange = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      (option) => option.id === +optionId
    );
    setSelectedSubCategory(selectedOption || null);
  };

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

  const next = () => {
    try {
      if (isCheckSameCoverImage && !coverImageForAll)
        throw new Error('Please select cover image');
      if (files?.length === 0)
        throw new Error('Please select at least one file');
      if (!selectedCategoryVideos) throw new Error('Please select a category');
      files.forEach((file) => {
        if (!file.title) throw new Error('Please enter a title');
        if (!isCheckTitleByFile && !file.description)
          throw new Error('Please enter a description');
        if (!isCheckSameCoverImage && !file.coverImage)
          throw new Error('Please select cover image');
      });

      setStep('playlist');
    } catch (error) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Please fill out all inputs';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);
    }
  };

  const onFramesExtracted = async (imgs, index) => {
    try {
      const imagesExtracts: string[] = [];

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
          if (base64Img && typeof base64Img === 'string') {
            imagesExtracts.push(base64Img);
          }
        } catch (error) {
          console.error(error);
        }
      }

      setImageExtracts((prev) => {
        return {
          ...prev,
          [index]: imagesExtracts,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {username && (
        <>
          {editId ? null : (
            <StyledButton
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
              }}
              color="primary"
              startIcon={
                <VideoLibraryIcon
                  sx={{
                    color: '#FF0033',
                    width: menuIconSize,
                    height: menuIconSize,
                  }}
                />
              }
              onClick={() => {
                setIsOpen(true);
              }}
            >
              {t('core:publish.video', {
                postProcess: 'capitalizeFirstChar',
              })}
            </StyledButton>
          )}
        </>
      )}

      <Modal
        open={isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalBody
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {editId ? (
              <NewCrowdfundTitle>
                {t('core:publish.update_video', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
              </NewCrowdfundTitle>
            ) : (
              <NewCrowdfundTitle>
                {t('core:publish.publish_videos', {
                  postProcess: 'capitalizeEachFirstChar',
                })}
              </NewCrowdfundTitle>
            )}
          </Box>

          {step === 'videos' && (
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
                <FiltersRow>
                  {t('core:publish.populate_description', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                  <FiltersCheckbox
                    checked={isCheckDescriptionIsTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCheckDescriptionIsTitle(e.target.checked);
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
                  setTitlesPrefix(e.target.value.replace(titleFormatter, ''))
                }
                inputProps={{ maxLength: 180 }}
              />
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
              <Box>
                <CodecTypography>
                  {t('core:publish.supported_containers', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                  : <span style={{ fontWeight: 'bold' }}>MP4</span>, M4V, OGG,
                  WEBM, WAV
                </CodecTypography>
                <CodecTypography>
                  {t('core:publish.audio_codecs', {
                    postProcess: 'capitalizeEachFirstChar',
                  })}
                  : <span style={{ fontWeight: 'bold' }}>Opus</span>, MP3, FLAC,
                  PCM (8/16/32-bit, μ-law), Vorbis
                </CodecTypography>
                <CodecTypography>
                  {t('core:publish.video_codecs', {
                    postProcess: 'capitalizeEachFirstChar',
                  })}
                  : <span style={{ fontWeight: 'bold' }}>AV1</span>, VP8, VP9,
                  H.264
                </CodecTypography>
                <CodecTypography sx={{ fontWeight: '800', color: 'red' }}>
                  {t('core:publish.unsupported_codecs_description', {
                    postProcess: 'capitalizeEachFirstChar',
                  })}
                </CodecTypography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                {files?.length > 0 && (
                  <>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                      <InputLabel id="Category">
                        {t('core:publish.select_category', {
                          postProcess: 'capitalizeEachFirstChar',
                        })}
                      </InputLabel>
                      <Select
                        labelId="Category"
                        input={
                          <OutlinedInput
                            label={t('core:publish.select_category', {
                              postProcess: 'capitalizeEachFirstChar',
                            })}
                          />
                        }
                        value={selectedCategoryVideos?.id || ''}
                        onChange={handleOptionCategoryChangeVideos}
                      >
                        {categories.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {t(`category:categories.${option.id}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedCategoryVideos &&
                      subCategories[selectedCategoryVideos?.id] && (
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                          <InputLabel id="Category">
                            {t('core:publish.select_subcategory', {
                              postProcess: 'capitalizeEachFirstChar',
                            })}
                          </InputLabel>
                          <Select
                            labelId="Sub-Category"
                            input={
                              <OutlinedInput
                                label={t('core:publish.select_subcategory', {
                                  postProcess: 'capitalizeEachFirstChar',
                                })}
                              />
                            }
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
                                  {t(`category:subcategories.${option.id}`)}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      )}
                  </>
                )}
              </Box>
              {files?.length > 0 && isCheckSameCoverImage && (
                <>
                  {!coverImageForAll ? (
                    <ImageUploader
                      onPick={(img: string) => setCoverImageForAll(img)}
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
                assembleVideoDurations();
                return (
                  <React.Fragment key={index}>
                    <FrameExtractor
                      videoFile={file.file}
                      onFramesExtracted={(imgs) =>
                        onFramesExtracted(imgs, index)
                      }
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
                              handleOnchange(index, 'coverImage', img)
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
                            <CoverImagePreview
                              src={file?.coverImage}
                              alt="logo"
                            />
                            <TimesIcon
                              color={theme.palette.text.primary}
                              onClickFunc={() =>
                                handleOnchange(index, 'coverImage', '')
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
                        handleOnchange(index, 'title', e.target.value)
                      }
                      inputProps={{ maxLength: 180 }}
                      required
                    />
                    {!isCheckDescriptionIsTitle && (
                      <>
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
                            handleOnchange(index, 'description', value);
                          }}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          )}
          {step === 'playlist' && (
            <>
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <Typography>
                  {t('core:publish.playlist', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '18px',
                    marginTop: '20px',
                  }}
                >
                  {t('core:publish.add_vids_playlist', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                  }}
                >
                  {t('core:publish.add_vids_playlist_optional', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  gap: '20px',
                }}
              >
                <CrowdfundActionButton
                  variant="contained"
                  color={!playlistSetting ? 'success' : 'primary'}
                  onClick={() => {
                    setPlaylistSetting(null);
                  }}
                >
                  {t('core:publish.no_playlist', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
                <CrowdfundActionButton
                  color={playlistSetting === 'new' ? 'success' : 'primary'}
                  variant="contained"
                  onClick={() => {
                    setPlaylistSetting('new');
                  }}
                >
                  {t('core:publish.new_playlist', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
                <CrowdfundActionButton
                  color={playlistSetting === 'existing' ? 'success' : 'primary'}
                  variant="contained"
                  onClick={() => {
                    setPlaylistSetting('existing');
                  }}
                >
                  {t('core:publish.existing_playlist', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
              </Box>
              {playlistSetting === 'existing' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <CrowdfundSubTitleRow>
                    <CrowdfundSubTitle>
                      {t('core:publish.select_existing_playlist', {
                        postProcess: 'capitalizeFirstChar',
                      })}
                    </CrowdfundSubTitle>
                  </CrowdfundSubTitleRow>
                  <Typography>
                    {selectExistingPlaylist?.metadata?.title}
                  </Typography>
                  <CardContentContainerComment
                    sx={{
                      marginTop: '25px',
                      height: '450px',
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <Input
                        id="standard-adornment-name"
                        onChange={(e) => {
                          setFilterSearch(e.target.value);
                        }}
                        value={filterSearch}
                        placeholder={t(
                          'core:publish.playlist_search_by_title',
                          {
                            postProcess: 'capitalizeFirstChar',
                          }
                        )}
                        sx={{
                          borderBottom: '1px solid white',
                          '&&:before': {
                            borderBottom: 'none',
                          },
                          '&&:after': {
                            borderBottom: 'none',
                          },
                          '&&:hover:before': {
                            borderBottom: 'none',
                          },
                          '&&.Mui-focused:before': {
                            borderBottom: 'none',
                          },
                          '&&.Mui-focused': {
                            outline: 'none',
                          },
                          fontSize: '18px',
                        }}
                      />
                      <Button
                        onClick={() => {
                          search();
                        }}
                        variant="contained"
                      >
                        {t('core:navbar.search', {
                          postProcess: 'capitalizeFirstChar',
                        })}
                      </Button>
                    </Box>

                    {searchResults?.map((vid: any, index) => {
                      return (
                        <Box
                          key={vid?.identifier}
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            width: '100%',
                            alignItems: 'center',
                            padding: '10px',
                            borderRadius: '5px',
                            userSelect: 'none',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '14px',
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '18px',
                              wordBreak: 'break-word',
                            }}
                          >
                            {vid?.metadata?.title}
                          </Typography>
                          <AddIcon
                            onClick={() => {
                              setSelectExistingPlaylist(vid);
                            }}
                            sx={{
                              cursor: 'pointer',
                            }}
                          />
                        </Box>
                      );
                    })}
                  </CardContentContainerComment>
                </Box>
              )}
              {playlistSetting === 'new' && (
                <>
                  {!playlistCoverImage ? (
                    <ImageUploader
                      onPick={(img: string) => setPlaylistCoverImage(img)}
                    >
                      <AddCoverImageButton variant="contained">
                        {t('core:publish.add_cover_image', {
                          postProcess: 'capitalizeFirstChar',
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
                      <CoverImagePreview src={playlistCoverImage} alt="logo" />
                      <TimesIcon
                        color={theme.palette.text.primary}
                        onClickFunc={() => setPlaylistCoverImage(null)}
                        height={'32'}
                        width={'32'}
                      ></TimesIcon>
                    </LogoPreviewRow>
                  )}
                  <CustomInputField
                    name="title"
                    label={t('core:publish.title_playlist', {
                      postProcess: 'capitalizeFirstChar',
                    })}
                    variant="filled"
                    value={playlistTitle}
                    onChange={(e) => {
                      const value = e.target.value;
                      let formattedValue: string = value;

                      formattedValue = value.replace(titleFormatter, '');

                      setPlaylistTitle(formattedValue);
                    }}
                    inputProps={{ maxLength: 180 }}
                    required
                  />

                  <Typography
                    sx={{
                      fontSize: '18px',
                    }}
                  >
                    {t('core:publish.description_playlist', {
                      postProcess: 'capitalizeFirstChar',
                    })}
                  </Typography>
                  <TextEditor
                    inlineContent={playlistDescription}
                    setInlineContent={(value: string) => {
                      setPlaylistDescription(value);
                    }}
                  />
                  <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                    <InputLabel id="Category">
                      {t('core:publish.select_category', {
                        postProcess: 'capitalizeFirstChar',
                      })}
                    </InputLabel>
                    <Select
                      labelId="Category"
                      input={
                        <OutlinedInput
                          label={t('core:publish.select_category', {
                            postProcess: 'capitalizeFirstChar',
                          })}
                        />
                      }
                      value={selectedCategory?.id || ''}
                      onChange={handleOptionCategoryChange}
                    >
                      {categories.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {t(`category:categories.${option.id}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedCategory && subCategories[selectedCategory?.id] && (
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                      <InputLabel id="Category">
                        {t('core:publish.select_subcategory', {
                          postProcess: 'capitalizeFirstChar',
                        })}
                      </InputLabel>
                      <Select
                        labelId="Sub-Category"
                        input={
                          <OutlinedInput
                            label={t('core:publish.select_subcategory', {
                              postProcess: 'capitalizeFirstChar',
                            })}
                          />
                        }
                        value={selectedSubCategory?.id || ''}
                        onChange={(e) =>
                          handleOptionSubCategoryChange(
                            e,
                            subCategories[selectedCategory?.id]
                          )
                        }
                      >
                        {subCategories[selectedCategory.id].map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {t(`category:subcategories.${option.id}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}
            </>
          )}

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
              {step === 'playlist' && (
                <CrowdfundActionButton
                  variant="contained"
                  onClick={() => {
                    setStep('videos');
                  }}
                >
                  {t('core:action.back', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
              )}
              {step === 'playlist' ? (
                <CrowdfundActionButton
                  variant="contained"
                  onClick={() => {
                    publishQDNResource();
                  }}
                >
                  {t('core:publish.publish_action', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
              ) : (
                <CrowdfundActionButton
                  variant="contained"
                  disabled={
                    files?.length !== Object.keys(imageExtracts)?.length
                  }
                  onClick={() => {
                    next();
                  }}
                >
                  {files?.length !== Object.keys(imageExtracts)?.length
                    ? t('core:publish.generationg_extracts', {
                        postProcess: 'capitalizeFirstChar',
                      })
                    : ''}
                  {files?.length !== Object.keys(imageExtracts)?.length && (
                    <CircularProgress color="secondary" size={14} />
                  )}
                  {t('core:publish.next', {
                    postProcess: 'capitalizeFirstChar',
                  })}
                </CrowdfundActionButton>
              )}
            </Box>
          </CrowdfundActionButtonRow>
        </ModalBody>
      </Modal>
    </>
  );
};
