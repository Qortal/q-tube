import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";

import {
  AddCoverImageButton,
  AddLogoIcon,
  CoverImagePreview,
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  CustomInputField,
  CustomSelect,
  LogoPreviewRow,
  ModalBody,
  NewCrowdfundTitle,
  StyledButton,
  TimesIcon,
} from "./EditVideo-styles.tsx";
import { CircularProgress } from "@mui/material";

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
} from "@mui/material";
import ShortUniqueId from "short-unique-id";
import { useDispatch, useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDropzone } from "react-dropzone";

import { setNotification } from "../../../state/features/notificationsSlice.ts";
import { objectToBase64, uint8ArrayToBase64 } from "../../../utils/toBase64.ts";
import { RootState } from "../../../state/store.ts";
import {
  upsertVideosBeginning,
  addToHashMap,
  upsertVideos,
  setEditVideo,
  updateVideo,
  updateInHashMap,
} from "../../../state/features/videoSlice.ts";
import ImageUploader from "../../common/ImageUploader.tsx";
import { categories, subCategories } from "../../../constants/Categories.ts";
import { ratings } from "../../../constants/Ratings.ts";
import { MultiplePublish } from "../MultiplePublish/MultiplePublishAll.tsx";
import { TextEditor } from "../../common/TextEditor/TextEditor.tsx";
import { extractTextFromHTML } from "../../common/TextEditor/utils.ts";
import { toBase64 } from "../PublishVideo/PublishVideo.tsx";
import { FrameExtractor } from "../../common/FrameExtractor/FrameExtractor.tsx";
import { QTUBE_VIDEO_BASE } from "../../../constants/Identifiers.ts";
import { titleFormatter } from "../../../constants/Misc.ts";

const uid = new ShortUniqueId();
const shortuid = new ShortUniqueId({ length: 5 });

interface NewCrowdfundProps {
  editId?: string;
  editContent?: null | {
    title: string;
    user: string;
    coverImage: string | null;
  };
}

interface VideoFile {
  file: File;
  title: string;
  description: string;
  coverImage?: string;
}
export const EditVideo = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth?.user?.name);
  const userAddress = useSelector(
    (state: RootState) => state.auth?.user?.address
  );
  const editVideoProperties = useSelector(
    (state: RootState) => state.video.editVideoProperties
  );
  const [publishes, setPublishes] = useState<any>(null);
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [videoPropertiesToSetToRedux, setVideoPropertiesToSetToRedux] =
    useState(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [file, setFile] = useState(null);
  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);
  const [selectedRatingVideos, setSelectedRatingVideos] =
    useState<any>(null);
  const [imageExtracts, setImageExtracts] = useState<any>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [],
    },
    maxFiles: 1,
    maxSize: 419430400, // 400 MB in bytes
    onDrop: (acceptedFiles, rejectedFiles) => {
      const firstFile = acceptedFiles[0];

      setFile(firstFile);

      let errorString = null;

      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === "file-too-large") {
            errorString = "File must be under 400mb";
          }
          console.log(`Error with file ${file.name}: ${error.message}`);
        });
      });
      if (errorString) {
        const notificationObj = {
          msg: errorString,
          alertType: "error",
        };

        dispatch(setNotification(notificationObj));
      }
    },
  });

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

  //     // Initialize variables to hold the category, subcategory, and rating values
  //     let category, subcategory, rating;

  //     // Loop through each key-value pair
  //     keyValuePairs.forEach((pair) => {
  //       const [key, value] = pair.split(":");

  //       // Check the key and assign the value to the appropriate variable
  //       if (key === "category") {
  //         category = value;
  //       } else if (key === "subcategory") {
  //         subcategory = value;
  //       } else if (key === "rating") {
  //         rating = value;
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

  //     if(rating){
  //       const selectedOption = ratings.find((option) => option.id === +rating);
  //   setSelectedRatingVideos(selectedOption || null);
  //     }

  //   }
  // }, [editVideoProperties]);

  useEffect(() => {
    if (editVideoProperties) {
      setTitle(editVideoProperties?.title || "");
      if (editVideoProperties?.htmlDescription) {
        setDescription(editVideoProperties?.htmlDescription);
      } else if (editVideoProperties?.fullDescription) {
        const paragraph = `<p>${editVideoProperties?.fullDescription}</p>`;
        setDescription(paragraph);
      }
      setCoverImage(editVideoProperties?.videoImage || "");

      if (editVideoProperties?.category) {
        const selectedOption = categories.find(
          option => option.id === +editVideoProperties.category
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
        ]?.find(option => option.id === +editVideoProperties.subcategory);
        setSelectedSubCategoryVideos(selectedOption || null);
      }

      if (editVideoProperties?.rating) {
        const selectedOption = ratings.find(
          option => option.id === +editVideoProperties.rating
        );
        setSelectedRatingVideos(selectedOption || null);
      }
    }
  }, [editVideoProperties]);

  const onClose = () => {
    dispatch(setEditVideo(null));
    setVideoPropertiesToSetToRedux(null);
    setFile(null);
    setTitle("");
    setImageExtracts([]);
    setDescription("");
    setCoverImage("");
  };

  async function publishQDNResource() {
    try {
      if (!title) throw new Error("Please enter a title");
      if (!description) throw new Error("Please enter a description");
      if (!coverImage) throw new Error("Please select cover image");
      if (!selectedCategoryVideos) throw new Error("Please select a category");
      if (!selectedRatingVideos) throw new Error("Please select a rating");
      if (!editVideoProperties) return;
      if (!userAddress) throw new Error("Unable to locate user address");
      let errorMsg = "";
      let name = "";
      if (username) {
        name = username;
      }
      if (!name) {
        errorMsg =
          "Cannot publish without access to your name. Please authenticate.";
      }

      if (editVideoProperties?.user !== username) {
        errorMsg = "Cannot publish another user's resource";
      }

      if (errorMsg) {
        dispatch(
          setNotification({
            msg: errorMsg,
            alertType: "error",
          })
        );
        return;
      }
      let listOfPublishes = [];
      const category = selectedCategoryVideos.id;
      const subcategory = selectedSubCategoryVideos?.id || "";
      const rating = selectedRatingVideos.id;

      const fullDescription = extractTextFromHTML(description);
      let fileExtension = "mp4";
      const fileExtensionSplit = file?.name?.split(".");
      if (fileExtensionSplit?.length > 1) {
        fileExtension = fileExtensionSplit?.pop() || "mp4";
      }

      let filename = title.slice(0, 15);
      // Step 1: Replace all white spaces with underscores

      // Replace all forms of whitespace (including non-standard ones) with underscores
      let stringWithUnderscores = filename.replace(/[\s\uFEFF\xA0]+/g, "_");

      // Remove all non-alphanumeric characters (except underscores)
      let alphanumericString = stringWithUnderscores.replace(
        /[^a-zA-Z0-9_]/g,
        ""
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
        rating,
        code: editVideoProperties.code,
        videoType: file?.type || "video/mp4",
        filename: `${alphanumericString.trim()}.${fileExtension}`,
      };

      let metadescription =
        `**category:${category};subcategory:${subcategory};rating:${rating};code:${editVideoProperties.code}**` +
        description.slice(0, 140);

      const crowdfundObjectToBase64 = await objectToBase64(videoObject);
      // Description is obtained from raw data
      const requestBodyJson: any = {
        action: "PUBLISH_QDN_RESOURCE",
        name: username,
        service: "DOCUMENT",
        data64: crowdfundObjectToBase64,
        title: title.slice(0, 50),
        description: metadescription,
        identifier: editVideoProperties.id,
        tag1: QTUBE_VIDEO_BASE,
        filename: `video_metadata.json`,
      };
      listOfPublishes.push(requestBodyJson);

      if (file && editVideoProperties.videoReference?.identifier) {
        const requestBodyVideo: any = {
          action: "PUBLISH_QDN_RESOURCE",
          name: username,
          service: "VIDEO",
          file,
          title: title.slice(0, 50),
          description: metadescription,
          identifier: editVideoProperties.videoReference?.identifier,
          tag1: QTUBE_VIDEO_BASE,
          filename: `${alphanumericString.trim()}.${fileExtension}`,
        };

        listOfPublishes.push(requestBodyVideo);
      }

      const multiplePublish = {
        action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
        resources: [...listOfPublishes],
      };
      setPublishes(multiplePublish);
      setIsOpenMultiplePublish(true);
      setVideoPropertiesToSetToRedux({
        ...editVideoProperties,
        ...videoObject,
      });
    } catch (error: any) {
      let notificationObj: any = null;
      if (typeof error === "string") {
        notificationObj = {
          msg: error || "Failed to publish update",
          alertType: "error",
        };
      } else if (typeof error?.error === "string") {
        notificationObj = {
          msg: error?.error || "Failed to publish update",
          alertType: "error",
        };
      } else {
        notificationObj = {
          msg: error?.message || "Failed to publish update",
          alertType: "error",
        };
      }
      if (!notificationObj) return;
      dispatch(setNotification(notificationObj));

      throw new Error("Failed to publish update");
    }
  }

  const handleOptionCategoryChangeVideos = (
    event: SelectChangeEvent<string>
  ) => {
    const optionId = event.target.value;
    const selectedOption = categories.find(option => option.id === +optionId);
    setSelectedCategoryVideos(selectedOption || null);
  };
  const handleOptionSubCategoryChangeVideos = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      option => option.id === +optionId
    );
    setSelectedSubCategoryVideos(selectedOption || null);
  };
  const handleOptionRatingChangeVideos = (
    event: SelectChangeEvent<string>
  ) => {
    const optionId = event.target.value;
    const selectedOption = ratings.find(option => option.id === +optionId);
    setSelectedRatingVideos(selectedOption || null);
  };

  const onFramesExtracted = async imgs => {
    try {
      let imagesExtracts = [];

      for (const img of imgs) {
        try {
          let compressedFile;
          const image = img;
          await new Promise<void>(resolve => {
            new Compressor(image, {
              quality: 0.8,
              maxWidth: 750,
              mimeType: "image/webp",
              success(result) {
                const file = new File([result], "name", {
                  type: "image/webp",
                });
                compressedFile = file;
                resolve();
              },
              error(err) {},
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
    } catch (error) {}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <NewCrowdfundTitle>Update Video properties</NewCrowdfundTitle>
          </Box>
          <>
            <Box
              {...getRootProps()}
              sx={{
                border: "1px dashed gray",
                padding: 2,
                textAlign: "center",
                marginBottom: 2,
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography>Click to update video file - optional</Typography>
            </Box>
            <Typography
              sx={{
                marginBottom: "10px",
              }}
            >
              {file?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="Category">Select a Category</InputLabel>
                <Select
                  labelId="Category"
                  input={<OutlinedInput label="Select a Category" />}
                  value={selectedCategoryVideos?.id || ""}
                  onChange={handleOptionCategoryChangeVideos}
                >
                  {categories.map(option => (
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
                      value={selectedSubCategoryVideos?.id || ""}
                      onChange={e =>
                        handleOptionSubCategoryChangeVideos(
                          e,
                          subCategories[selectedCategoryVideos?.id]
                        )
                      }
                    >
                      {subCategories[selectedCategoryVideos.id].map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="Rating">Select a Rating</InputLabel>
                <Select
                  labelId="Rating"
                  input={<OutlinedInput label="Select a Rating" />}
                  value={selectedRatingVideos?.id || ""}
                  onChange={handleOptionRatingChangeVideos}
                >
                  {ratings.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {file && (
              <FrameExtractor
                videoFile={file}
                onFramesExtracted={imgs => onFramesExtracted(imgs)}
              />
            )}
            <React.Fragment>
              {!coverImage ? (
                <ImageUploader onPick={(img: string) => setCoverImage(img)}>
                  <AddCoverImageButton variant="contained">
                    Add Cover Image
                    <AddLogoIcon
                      sx={{
                        height: "25px",
                        width: "auto",
                      }}
                    ></AddLogoIcon>
                  </AddCoverImageButton>
                </ImageUploader>
              ) : (
                <LogoPreviewRow>
                  <CoverImagePreview src={coverImage} alt="logo" />
                  <TimesIcon
                    color={theme.palette.text.primary}
                    onClickFunc={() => setCoverImage("")}
                    height={"32"}
                    width={"32"}
                  ></TimesIcon>
                </LogoPreviewRow>
              )}
              <CustomInputField
                name="title"
                label="Title of video"
                variant="filled"
                value={title}
                onChange={e => {
                  const value = e.target.value;
                  const formattedValue = value.replace(titleFormatter, "");
                  setTitle(formattedValue);
                }}
                inputProps={{ maxLength: 180 }}
                required
              />
              <Typography
                sx={{
                  fontSize: "18px",
                }}
              >
                Description of video
              </Typography>
              <TextEditor
                inlineContent={description}
                setInlineContent={value => {
                  setDescription(value);
                }}
              />
              {/* <CustomInputField
                name="description"
                label="Describe your video in a few words"
                variant="filled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputProps={{ maxLength: 10000 }}
                multiline
                maxRows={3}
                required
              /> */}
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
                display: "flex",
                gap: "20px",
                alignItems: "center",
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
      {isOpenMultiplePublish && (
        <MultiplePublish
          isOpen={isOpenMultiplePublish}
          onError={messageNotification => {
            setIsOpenMultiplePublish(false);
            setPublishes(null);
            if (messageNotification) {
              dispatch(
                setNotification({
                  msg: messageNotification,
                  alertType: "error",
                })
              );
            }
          }}
          onSubmit={() => {
            setIsOpenMultiplePublish(false);
            const clonedCopy = structuredClone(videoPropertiesToSetToRedux);
            dispatch(updateVideo(clonedCopy));
            dispatch(updateInHashMap(clonedCopy));
            dispatch(
              setNotification({
                msg: "Video updated",
                alertType: "success",
              })
            );
            onClose();
          }}
          publishes={publishes}
        />
      )}
    </>
  );
};
