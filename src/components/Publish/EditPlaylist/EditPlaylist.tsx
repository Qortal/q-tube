import React, { useEffect, useMemo, useState } from 'react';
import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  CustomInputField,
  ModalBody,
  LogoPreviewRow,
  NewCrowdfundTitle,
  TimesIcon,
} from './Upload-styles.tsx';
import {
  Box,
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
import ShortUniqueId from 'short-unique-id';
import { useDispatch, useSelector } from 'react-redux';

import { setNotification } from '../../../state/features/notificationsSlice.ts';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import { RootState } from '../../../state/store.ts';
import {
  updateVideo,
  updateInHashMap,
  setEditPlaylist,
} from '../../../state/features/videoSlice.ts';
import ImageUploader from '../../common/ImageUploader.tsx';
import { categories, subCategories } from '../../../constants/Categories.ts';
import { Playlists } from '../../Playlists/Playlists.tsx';
import { PlaylistListEdit } from '../PlaylistListEdit/PlaylistListEdit.tsx';
import { TextEditor } from '../../common/TextEditor/TextEditor.tsx';
import { extractTextFromHTML } from '../../common/TextEditor/utils.ts';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../../constants/Identifiers.ts';
import { useAuth } from 'qapp-core';

const uid = new ShortUniqueId();
const shortuid = new ShortUniqueId({ length: 5 });

export const EditPlaylist = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { name: username, address: userAddress } = useAuth();

  const editVideoProperties = useSelector(
    (state: RootState) => state.video.editPlaylistProperties
  );
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [videos, setVideos] = useState([]);
  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);

  const isNew = useMemo(() => {
    return editVideoProperties?.mode === 'new';
  }, [editVideoProperties]);

  useEffect(() => {
    if (isNew) {
      setPlaylistData({
        videos: [],
      });
    }
  }, [isNew]);

  // useEffect(() => {
  //   if (editVideoProperties) {
  //     const descriptionString = editVideoProperties?.description || "";
  //     // Splitting the string at the asterisks
  //     const parts = descriptionString.split("**");

  //     // The part within the asterisks
  //     const extractedString = parts[1];

  //     // The part after the last asterisks
  //     const description = parts[2] || ""; // Using '|| '' to handle cases where there is no text after the last **
  //     setTitle(editVideoProperties?.title || "");
  //     setDescription(editVideoProperties?.fullDescription || "");
  //     setCoverImage(editVideoProperties?.videoImage || "");

  //     // Split the extracted string into key-value pairs
  //     const keyValuePairs = extractedString.split(";");

  //     // Initialize variables to hold the category and subcategory values
  //     let category, subcategory;

  //     // Loop through each key-value pair
  //     keyValuePairs.forEach((pair) => {
  //       const [key, value] = pair.split(":");

  //       // Check the key and assign the value to the appropriate variable
  //       if (key === "category") {
  //         category = value;
  //       } else if (key === "subcategory") {
  //         subcategory = value;
  //       }
  //     });

  //     if(category){
  //       const selectedOption = categories.find((option) => option.id === +category);
  //   setSelectedCategoryVideos(selectedOption || null);
  //     }

  //     if(subcategory){
  //       const selectedOption = categories.find((option) => option.id === +subcategory);
  //   setSelectedCategoryVideos(selectedOption || null);
  //     }

  //   }
  // }, [editVideoProperties]);

  const checkforPlaylist = React.useCallback(async (videoList) => {
    try {
      const combinedData: any = {};
      const videos = [];
      if (videoList) {
        for (const vid of videoList) {
          const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&identifier=${vid.identifier}&limit=1&includemetadata=true&reverse=true&name=${vid.name}&exactmatchnames=true&offset=0`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const responseDataSearchVid = await response.json();

          if (responseDataSearchVid?.length > 0) {
            const resourceData2 = responseDataSearchVid[0];
            videos.push(resourceData2);
          }
        }
      }
      combinedData.videos = videos;
      setPlaylistData(combinedData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (editVideoProperties) {
      setTitle(editVideoProperties?.title || '');

      if (editVideoProperties?.htmlDescription) {
        setDescription(editVideoProperties?.htmlDescription);
      } else if (editVideoProperties?.description) {
        const paragraph = `<p>${editVideoProperties?.description}</p>`;
        setDescription(paragraph);
      }
      setCoverImage(editVideoProperties?.image || '');
      setVideos(editVideoProperties?.videos || []);

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

      if (editVideoProperties?.videos) {
        checkforPlaylist(editVideoProperties?.videos);
      }
    }
  }, [editVideoProperties]);

  const onClose = () => {
    setTitle('');
    setDescription('');
    setVideos([]);
    setPlaylistData(null);
    setSelectedCategoryVideos(null);
    setSelectedSubCategoryVideos(null);
    setCoverImage('');
    dispatch(setEditPlaylist(null));
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

      if (!isNew && editVideoProperties?.user !== username) {
        errorMsg = "Cannot publish another user's resource";
      }

      if (errorMsg) {
        dispatch(
          setNotification({
            msg: errorMsg,
            alertType: 'error',
          })
        );
        return;
      }
      const category = selectedCategoryVideos.id;
      const subcategory = selectedSubCategoryVideos?.id || '';

      const videoStructured = playlistData.videos.map((item) => {
        const descriptionVid = item?.metadata?.description;
        if (!descriptionVid) throw new Error('cannot find video code');

        // Split the string by ';'
        const parts = descriptionVid.split(';');

        // Initialize a variable to hold the code value
        let codeValue = '';

        // Loop through the parts to find the one that starts with 'code:'
        for (const part of parts) {
          if (part.startsWith('code:')) {
            codeValue = part.split(':')[1];
            break;
          }
        }
        if (!codeValue) throw new Error('cannot find video code');

        return {
          identifier: item.identifier,
          name: item.name,
          service: item.service,
          code: codeValue,
        };
      });
      const id = uid.rnd();

      let commentsId = editVideoProperties?.id;

      if (isNew) {
        commentsId = `${QTUBE_PLAYLIST_BASE}_cm_${id}`;
      }
      const stringDescription = extractTextFromHTML(description);

      const playlistObject: any = {
        title,
        version: 1,
        description: stringDescription,
        htmlDescription: description,
        image: coverImage,
        videos: videoStructured,
        commentsId: commentsId,
        category,
        subcategory,
      };

      const codes = videoStructured
        .map((item) => `c:${item.code};`)
        .slice(0, 10)
        .join('');
      const metadescription =
        `**category:${category};subcategory:${subcategory};${codes}**` +
        stringDescription.slice(0, 120);

      // Description is obtained from raw data

      let identifier = editVideoProperties?.id;
      const sanitizeTitle = title
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .toLowerCase();
      if (isNew) {
        identifier = `${QTUBE_PLAYLIST_BASE}${sanitizeTitle.slice(
          0,
          30
        )}_${id}`;
      }
      const requestBodyJson: any = {
        action: 'PUBLISH_QDN_RESOURCE',
        name: username,
        service: 'PLAYLIST',
        data64: await objectToBase64(playlistObject),
        title: title.slice(0, 50),
        description: metadescription,
        identifier: identifier,
        tag1: QTUBE_VIDEO_BASE,
      };

      await qortalRequest(requestBodyJson);
      if (isNew) {
        const objectToStore = {
          title: title.slice(0, 50),
          description: metadescription,
          id: identifier,
          service: 'PLAYLIST',
          user: username,
          ...playlistObject,
        };
        dispatch(updateVideo(objectToStore));
        dispatch(updateInHashMap(objectToStore));
      } else {
        dispatch(
          updateVideo({
            ...editVideoProperties,
            ...playlistObject,
          })
        );
        dispatch(
          updateInHashMap({
            ...editVideoProperties,
            ...playlistObject,
          })
        );
      }

      dispatch(
        setNotification({
          msg: 'Playlist published',
          alertType: 'success',
        })
      );

      onClose();
    } catch (error: any) {
      let notificationObj: any = null;
      if (typeof error === 'string') {
        notificationObj = {
          msg: error || 'Failed to publish update',
          alertType: 'error',
        };
      } else if (typeof error?.error === 'string') {
        notificationObj = {
          msg: error?.error || 'Failed to publish update',
          alertType: 'error',
        };
      } else {
        notificationObj = {
          msg: error?.message || 'Failed to publish update',
          alertType: 'error',
        };
      }
      if (!notificationObj) return;
      dispatch(setNotification(notificationObj));

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

  const removeVideo = (index) => {
    const copyData = structuredClone(playlistData);
    copyData.videos.splice(index, 1);
    setPlaylistData(copyData);
  };

  const addVideo = (data) => {
    const copyData = structuredClone(playlistData);
    copyData.videos = [...copyData.videos, { ...data }];
    setPlaylistData(copyData);
  };

  const updateVideoList = (list) => {
    const copyData = structuredClone(playlistData);
    copyData.videos = [...list];
    setPlaylistData(copyData);
  };

  return (
    <>
      <Modal
        open={!!editVideoProperties}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalBody>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isNew ? (
              <NewCrowdfundTitle>Create new playlist</NewCrowdfundTitle>
            ) : (
              <NewCrowdfundTitle>Update Playlist properties</NewCrowdfundTitle>
            )}
          </Box>
          <>
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
              <CustomInputField
                name="title"
                label="Title of playlist"
                variant="filled"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.replace(
                    /[^a-zA-Z0-9\s-_!?]/g,
                    ''
                  );
                  setTitle(formattedValue);
                }}
                inputProps={{ maxLength: 180 }}
                required
              />
              {/* <CustomInputField
                name="description"
                label="Describe your playlist in a few words"
                variant="filled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputProps={{ maxLength: 10000 }}
                multiline
                maxRows={3}
                required
              /> */}
              <Typography
                sx={{
                  fontSize: '18px',
                }}
              >
                Description of playlist
              </Typography>
              <TextEditor
                inlineContent={description}
                setInlineContent={(value) => {
                  setDescription(value);
                }}
              />
            </React.Fragment>

            <PlaylistListEdit
              playlistData={playlistData}
              updateVideoList={updateVideoList}
              removeVideo={removeVideo}
              addVideo={addVideo}
            />
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
              >
                Publish
              </CrowdfundActionButton>
            </Box>
          </CrowdfundActionButtonRow>
        </ModalBody>
      </Modal>
    </>
  );
};
