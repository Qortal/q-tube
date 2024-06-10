import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";
import {
  AddCoverImageButton,
  AddLogoIcon,
  CodecTypography,
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
} from "./PublishVideo-styles.tsx";
import { CircularProgress } from "@mui/material";

import {
  Box,
  Button,
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
} from "@mui/material";
import ShortUniqueId from "short-unique-id";
import { useDispatch, useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";

import { setNotification } from "../../../state/features/notificationsSlice.ts";
import { objectToBase64, uint8ArrayToBase64 } from "../../../utils/toBase64.ts";
import { RootState } from "../../../state/store.ts";
import {
  upsertVideosBeginning,
  addToHashMap,
  upsertVideos,
} from "../../../state/features/videoSlice.ts";
import ImageUploader from "../../common/ImageUploader.tsx";
import { categories, subCategories } from "../../../constants/Categories.ts";
import { ratings } from "../../../constants/Ratings.ts";
import { MultiplePublish } from "../MultiplePublish/MultiplePublishAll.tsx";
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from "../EditPlaylist/Upload-styles.tsx";
import { CardContentContainerComment } from "../../common/Comments/Comments-styles.tsx";
import { TextEditor } from "../../common/TextEditor/TextEditor.tsx";
import { extractTextFromHTML } from "../../common/TextEditor/utils.ts";
import {
  FiltersCheckbox,
  FiltersRow,
  FiltersSubContainer,
} from "../../../pages/Home/VideoList-styles.tsx";
import { FrameExtractor } from "../../common/FrameExtractor/FrameExtractor.tsx";
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from "../../../constants/Identifiers.ts";
import { titleFormatter } from "../../../constants/Misc.ts";
import { getFileName } from "../../../utils/stringFunctions.ts";

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => {
      reject(error);
    };
  });

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
export const PublishVideo = ({ editId, editContent }: NewCrowdfundProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const username = useSelector((state: RootState) => state.auth?.user?.name);
  const userAddress = useSelector(
    (state: RootState) => state.auth?.user?.address
  );
  const [files, setFiles] = useState<VideoFile[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coverImageForAll, setCoverImageForAll] = useState<null | string>("");

  const [step, setStep] = useState<string>("videos");
  const [playlistCoverImage, setPlaylistCoverImage] = useState<null | string>(
    null
  );
  const [selectExistingPlaylist, setSelectExistingPlaylist] =
    useState<any>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [titlesPrefix, setTitlesPrefix] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedRating, setSelectedRating] = useState<any>(null);

  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);
  const [selectedRatingVideos, setSelectedRatingVideos] =
    useState<any>(null);

  const [playlistSetting, setPlaylistSetting] = useState<null | string>(null);
  const [publishes, setPublishes] = useState<any>(null);
  const [isCheckTitleByFile, setIsCheckTitleByFile] = useState(true);
  const [isCheckSameCoverImage, setIsCheckSameCoverImage] = useState(true);
  const [isCheckDescriptionIsTitle, setIsCheckDescriptionIsTitle] =
    useState(false);
  const [imageExtracts, setImageExtracts] = useState<any>({});
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [],
    },
    maxSize: 419430400, // 400 MB in bytes
    onDrop: (acceptedFiles, rejectedFiles) => {
      const formatArray = acceptedFiles.map(item => {
        let filteredTitle = "";

        if (isCheckTitleByFile) {
          const fileName = getFileName(item?.name || "");
          filteredTitle = (titlesPrefix + fileName).replace(titleFormatter, "");
        }
        return {
          file: item,
          title: filteredTitle || "",
          description: "",
          coverImage: "",
        };
      });

      setFiles(prev => [...prev, ...formatArray]);

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

  useEffect(() => {
    if (editContent) {
    }
  }, [editContent]);

  const onClose = () => {
    setIsOpen(false);
  };

  const search = async () => {
    const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&mode=ALL&identifier=${QTUBE_PLAYLIST_BASE}&title=${filterSearch}&limit=20&includemetadata=true&reverse=true&name=${username}&exactmatchnames=true&offset=0`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataSearchVid = await response.json();
    setSearchResults(responseDataSearchVid);
  };

  async function publishQDNResource() {
    try {
      if (playlistSetting === "new") {
        if (!playlistTitle) throw new Error("Please enter a title");
        if (!playlistDescription) throw new Error("Please enter a description");
        if (!playlistCoverImage) throw new Error("Please select cover image");
        if (!selectedCategory) throw new Error("Please select a category");
        if (!selectedRating) throw new Error("Please select a rating");
      }
      if (files?.length === 0)
        throw new Error("Please select at least one file");
      if (isCheckSameCoverImage && !coverImageForAll)
        throw new Error("Please select cover image");
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

      if (editId && editContent?.user !== name) {
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

      for (let i = 0; i < files.length; i++) {
        const publish = files[i];
        const title = publish.title;
        const description = isCheckDescriptionIsTitle
          ? publish.title
          : publish.description;
        const category = selectedCategoryVideos.id;
        const subcategory = selectedSubCategoryVideos?.id || "";
        const rating = selectedRatingVideos.id;
        const coverImage = isCheckSameCoverImage
          ? coverImageForAll
          : publish.coverImage;
        const file = publish.file;
        const sanitizeTitle = title
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
          .toLowerCase();

        const id = uid();

        const identifier = editId
          ? editId
          : `${QTUBE_VIDEO_BASE}${sanitizeTitle.slice(0, 30)}_${id}`;

        const code = shortuid();
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
          version: 1,
          fullDescription,
          htmlDescription: description,
          videoImage: coverImage,
          videoReference: {
            name,
            identifier: identifier,
            service: "VIDEO",
          },
          extracts: imageExtracts[i],
          commentsId: `${QTUBE_VIDEO_BASE}_cm_${id}`,
          category,
          subcategory,
          rating,
          code,
          videoType: file?.type || "video/mp4",
          filename: `${alphanumericString.trim()}.${fileExtension}`,
        };

        let metadescription =
          `**category:${category};subcategory:${subcategory};rating:${rating};code:${code}**` +
          fullDescription.slice(0, 140);

        const crowdfundObjectToBase64 = await objectToBase64(videoObject);
        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: "PUBLISH_QDN_RESOURCE",
          name: name,
          service: "DOCUMENT",
          data64: crowdfundObjectToBase64,
          title: title.slice(0, 50),
          description: metadescription,
          identifier: identifier + "_metadata",
          tag1: QTUBE_VIDEO_BASE,
          filename: `video_metadata.json`,
          code,
        };
        const requestBodyVideo: any = {
          action: "PUBLISH_QDN_RESOURCE",
          name: name,
          service: "VIDEO",
          file,
          title: title.slice(0, 50),
          description: metadescription,
          identifier,
          filename: `${alphanumericString.trim()}.${fileExtension}`,
          tag1: QTUBE_VIDEO_BASE,
        };
        listOfPublishes.push(requestBodyJson);
        listOfPublishes.push(requestBodyVideo);
      }

      const isNewPlaylist = playlistSetting === "new";

      if (isNewPlaylist) {
        const title = playlistTitle;
        const description = playlistDescription;
        const stringDescription = extractTextFromHTML(description);
        const category = selectedCategory.id;
        const subcategory = selectedSubCategory?.id || "";
        const rating = selectedRating.id;
        const coverImage = playlistCoverImage;
        const sanitizeTitle = title
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
          .toLowerCase();

        const id = uid();

        const identifier = editId
          ? editId
          : `${QTUBE_PLAYLIST_BASE}${sanitizeTitle.slice(0, 30)}_${id}`;

        const videos = listOfPublishes
          .filter(
            item =>
              item.service === "DOCUMENT" && item.tag1 === QTUBE_VIDEO_BASE
          )
          .map(vid => {
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
          rating,
        };

        const codes = videos
          .map(item => `c:${item.code};`)
          .slice(0, 10)
          .join("");

        let metadescription =
          `**category:${category};subcategory:${subcategory};rating:${rating};${codes}**` +
          stringDescription.slice(0, 110);

        const crowdfundObjectToBase64 = await objectToBase64(playlistObject);
        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: "PUBLISH_QDN_RESOURCE",
          name: name,
          service: "PLAYLIST",
          data64: crowdfundObjectToBase64,
          title: title.slice(0, 50),
          description: metadescription,
          identifier: identifier + "_metadata",
          tag1: QTUBE_VIDEO_BASE,
        };

        listOfPublishes.push(requestBodyJson);
      } else if (playlistSetting === "existing") {
        if (!selectExistingPlaylist) {
          throw new Error("select a playlist");
        }

        // get raw data for playlist
        const responseData = await qortalRequest({
          action: "FETCH_QDN_RESOURCE",
          name: selectExistingPlaylist.name,
          service: selectExistingPlaylist.service,
          identifier: selectExistingPlaylist.identifier,
        });
        if (responseData && !responseData.error) {
          const videos = listOfPublishes
            .filter(
              item =>
                item.service === "DOCUMENT" && item.tag1 === QTUBE_VIDEO_BASE
            )
            .map(vid => {
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
            .map(item => `c:${item.code};`)
            .slice(0, 10)
            .join("");

          let metadescription =
            `**category:${playlistObject.category};subcategory:${playlistObject.subcategory};rating:${playlistObject.rating};${codes}**` +
            playlistObject.description.slice(0, 110);

          const crowdfundObjectToBase64 = await objectToBase64(playlistObject);
          // Description is obtained from raw data
          const requestBodyJson: any = {
            action: "PUBLISH_QDN_RESOURCE",
            name: name,
            service: "PLAYLIST",
            data64: crowdfundObjectToBase64,
            title: playlistObject.title.slice(0, 50),
            description: metadescription,
            identifier: selectExistingPlaylist.identifier,
            tag1: QTUBE_VIDEO_BASE,
          };

          listOfPublishes.push(requestBodyJson);
        } else {
          throw new Error("cannot get playlist data");
        }
      }

      const multiplePublish = {
        action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
        resources: [...listOfPublishes],
      };
      setPublishes(multiplePublish);
      setIsOpenMultiplePublish(true);
    } catch (error: any) {
      let notificationObj: any = null;
      if (typeof error === "string") {
        notificationObj = {
          msg: error || "Failed to publish crowdfund",
          alertType: "error",
        };
      } else if (typeof error?.error === "string") {
        notificationObj = {
          msg: error?.error || "Failed to publish crowdfund",
          alertType: "error",
        };
      } else {
        notificationObj = {
          msg: error?.message || "Failed to publish crowdfund",
          alertType: "error",
        };
      }
      if (!notificationObj) return;
      dispatch(setNotification(notificationObj));

      throw new Error("Failed to publish crowdfund");
    }
  }

  const handleOnchange = (index: number, type: string, value: string) => {
    setFiles(prev => {
      let formattedValue = value;
      if (type === "title") {
        formattedValue = value.replace(titleFormatter, "");
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
    const selectedOption = categories.find(option => option.id === +optionId);
    setSelectedCategory(selectedOption || null);
  };
  const handleOptionSubCategoryChange = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      option => option.id === +optionId
    );
    setSelectedSubCategory(selectedOption || null);
  };
  const handleOptionRatingChange = (event: SelectChangeEvent<string>) => {
    const optionId = event.target.value;
    const selectedOption = ratings.find(option => option.id === +optionId);
    setSelectedRating(selectedOption || null);
  };

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

  const next = () => {
    try {
      if (isCheckSameCoverImage && !coverImageForAll)
        throw new Error("Please select cover image");
      if (files?.length === 0)
        throw new Error("Please select at least one file");
      if (!selectedCategoryVideos) throw new Error("Please select a category");
      if (!selectedRatingVideos) throw new Error("Please select a rating");
      files.forEach(file => {
        if (!file.title) throw new Error("Please enter a title");
        if (!isCheckTitleByFile && !file.description)
          throw new Error("Please enter a description");
        if (!isCheckSameCoverImage && !file.coverImage)
          throw new Error("Please select cover image");
      });

      setStep("playlist");
    } catch (error) {
      dispatch(
        setNotification({
          msg: error?.message || "Please fill out all inputs",
          alertType: "error",
        })
      );
    }
  };

  const onFramesExtracted = async (imgs, index) => {
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

      setImageExtracts(prev => {
        return {
          ...prev,
          [index]: imagesExtracts,
        };
      });
    } catch (error) {}
  };

  return (
    <>
      {username && (
        <>
          {editId ? null : (
            <StyledButton
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              add video
            </StyledButton>
          )}
        </>
      )}

      <Modal
        open={isOpen}
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
            {editId ? (
              <NewCrowdfundTitle>Update Videos</NewCrowdfundTitle>
            ) : (
              <NewCrowdfundTitle>Publish Videos</NewCrowdfundTitle>
            )}
          </Box>

          {step === "videos" && (
            <>
              <FiltersSubContainer>
                <FiltersRow>
                  Populate Titles by filename (when the files are picked)
                  <FiltersCheckbox
                    checked={isCheckTitleByFile}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCheckTitleByFile(e.target.checked);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </FiltersRow>
                <FiltersRow>
                  All videos use the same Cover Image
                  <FiltersCheckbox
                    checked={isCheckSameCoverImage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCheckSameCoverImage(e.target.checked);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </FiltersRow>
                <FiltersRow>
                  Populate all descriptions by Title
                  <FiltersCheckbox
                    checked={isCheckDescriptionIsTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCheckDescriptionIsTitle(e.target.checked);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </FiltersRow>
              </FiltersSubContainer>
              <CustomInputField
                name="prefix"
                label="Titles Prefix"
                variant="filled"
                value={titlesPrefix}
                onChange={e =>
                  setTitlesPrefix(e.target.value.replace(titleFormatter, ""))
                }
                inputProps={{ maxLength: 180 }}
              />
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
                <Typography>
                  Drag and drop a video files here or click to select files
                </Typography>
              </Box>
              <Box>
                <CodecTypography>
                  Supported File Containers:{" "}
                  <span style={{ fontWeight: "bold" }}>MP4</span>, Ogg, WebM,
                  WAV
                </CodecTypography>
                <CodecTypography>
                  Audio Codecs: <span style={{ fontWeight: "bold" }}>Opus</span>
                  , MP3, FLAC, PCM (8/16/32-bit, μ-law), Vorbis
                </CodecTypography>
                <CodecTypography>
                  Video Codecs: <span style={{ fontWeight: "bold" }}>AV1</span>,
                  VP8, VP9, H.264
                </CodecTypography>
                <CodecTypography sx={{ fontWeight: "800", color: "red" }}>
                  Using unsupported Codecs may result in video or audio not
                  working properly
                </CodecTypography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                {files?.length > 0 && (
                  <>
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
                          <InputLabel id="Category">
                            Select a Sub-Category
                          </InputLabel>
                          <Select
                            labelId="Sub-Category"
                            input={
                              <OutlinedInput label="Select a Sub-Category" />
                            }
                            value={selectedSubCategoryVideos?.id || ""}
                            onChange={e =>
                              handleOptionSubCategoryChangeVideos(
                                e,
                                subCategories[selectedCategoryVideos?.id]
                              )
                            }
                          >
                            {subCategories[selectedCategoryVideos.id].map(
                              option => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              )
                            )}
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
                      <CoverImagePreview src={coverImageForAll} alt="logo" />
                      <TimesIcon
                        color={theme.palette.text.primary}
                        onClickFunc={() => setCoverImageForAll(null)}
                        height={"32"}
                        width={"32"}
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
                      onFramesExtracted={imgs => onFramesExtracted(imgs, index)}
                    />
                    <Typography>{file?.file?.name}</Typography>
                    {!isCheckSameCoverImage && (
                      <>
                        {!file?.coverImage ? (
                          <ImageUploader
                            onPick={(img: string) =>
                              handleOnchange(index, "coverImage", img)
                            }
                          >
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
                            <CoverImagePreview
                              src={file?.coverImage}
                              alt="logo"
                            />
                            <TimesIcon
                              color={theme.palette.text.primary}
                              onClickFunc={() =>
                                handleOnchange(index, "coverImage", "")
                              }
                              height={"32"}
                              width={"32"}
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
                      onChange={e =>
                        handleOnchange(index, "title", e.target.value)
                      }
                      inputProps={{ maxLength: 180 }}
                      required
                    />
                    {!isCheckDescriptionIsTitle && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "18px",
                          }}
                        >
                          Description of video
                        </Typography>
                        <TextEditor
                          inlineContent={file?.description}
                          setInlineContent={value => {
                            handleOnchange(index, "description", value);
                          }}
                        />
                      </>
                    )}

                    {/* <CustomInputField
                      name="description"
                      label="Describe your video in a few words"
                      variant="filled"
                      value={file?.description}
                      onChange={(e) =>
                        handleOnchange(index, "description", e.target.value)
                      }
                      inputProps={{ maxLength: 10000 }}
                      multiline
                      maxRows={3}
                      required
                    /> */}
                  </React.Fragment>
                );
              })}
            </>
          )}
          {step === "playlist" && (
            <>
              <Box
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography>Playlist</Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    marginTop: "20px",
                  }}
                >
                  Would you like to add these videos to a playlist?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Add to a playlist is OPTIONAL
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  gap: "20px",
                }}
              >
                <CrowdfundActionButton
                  variant="contained"
                  color={!playlistSetting ? "success" : "primary"}
                  onClick={() => {
                    setPlaylistSetting(null);
                  }}
                >
                  no playlist
                </CrowdfundActionButton>
                <CrowdfundActionButton
                  color={playlistSetting === "new" ? "success" : "primary"}
                  variant="contained"
                  onClick={() => {
                    setPlaylistSetting("new");
                  }}
                >
                  New playlist
                </CrowdfundActionButton>
                <CrowdfundActionButton
                  color={playlistSetting === "existing" ? "success" : "primary"}
                  variant="contained"
                  onClick={() => {
                    setPlaylistSetting("existing");
                  }}
                >
                  Existing playlist
                </CrowdfundActionButton>
              </Box>
              {playlistSetting === "existing" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <CrowdfundSubTitleRow>
                    <CrowdfundSubTitle>
                      Select existing playlist
                    </CrowdfundSubTitle>
                  </CrowdfundSubTitleRow>
                  <Typography>
                    {selectExistingPlaylist?.metadata?.title}
                  </Typography>
                  <CardContentContainerComment
                    sx={{
                      marginTop: "25px",
                      height: "450px",
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Input
                        id="standard-adornment-name"
                        onChange={e => {
                          setFilterSearch(e.target.value);
                        }}
                        value={filterSearch}
                        placeholder="Search by title"
                        sx={{
                          borderBottom: "1px solid white",
                          "&&:before": {
                            borderBottom: "none",
                          },
                          "&&:after": {
                            borderBottom: "none",
                          },
                          "&&:hover:before": {
                            borderBottom: "none",
                          },
                          "&&.Mui-focused:before": {
                            borderBottom: "none",
                          },
                          "&&.Mui-focused": {
                            outline: "none",
                          },
                          fontSize: "18px",
                        }}
                      />
                      <Button
                        onClick={() => {
                          search();
                        }}
                        variant="contained"
                      >
                        Search
                      </Button>
                    </Box>

                    {searchResults?.map((vid, index) => {
                      return (
                        <Box
                          key={vid?.identifier}
                          sx={{
                            display: "flex",
                            gap: "10px",
                            width: "100%",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "5px",
                            userSelect: "none",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              wordBreak: "break-word",
                            }}
                          >
                            {vid?.metadata?.title}
                          </Typography>
                          <AddIcon
                            onClick={() => {
                              setSelectExistingPlaylist(vid);
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </CardContentContainerComment>
                </Box>
              )}
              {playlistSetting === "new" && (
                <>
                  {!playlistCoverImage ? (
                    <ImageUploader
                      onPick={(img: string) => setPlaylistCoverImage(img)}
                    >
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
                      <CoverImagePreview src={playlistCoverImage} alt="logo" />
                      <TimesIcon
                        color={theme.palette.text.primary}
                        onClickFunc={() => setPlaylistCoverImage(null)}
                        height={"32"}
                        width={"32"}
                      ></TimesIcon>
                    </LogoPreviewRow>
                  )}
                  <CustomInputField
                    name="title"
                    label="Title of playlist"
                    variant="filled"
                    value={playlistTitle}
                    onChange={e => {
                      const value = e.target.value;
                      let formattedValue: string = value;

                      formattedValue = value.replace(titleFormatter, "");

                      setPlaylistTitle(formattedValue);
                    }}
                    inputProps={{ maxLength: 180 }}
                    required
                  />
                  {/* <CustomInputField
                    name="description"
                    label="Describe your playlist in a few words"
                    variant="filled"
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    inputProps={{ maxLength: 10000 }}
                    multiline
                    maxRows={3}
                    required
                  /> */}

                  <Typography
                    sx={{
                      fontSize: "18px",
                    }}
                  >
                    Description of playlist
                  </Typography>
                  <TextEditor
                    inlineContent={playlistDescription}
                    setInlineContent={value => {
                      setPlaylistDescription(value);
                    }}
                  />
                  <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                    <InputLabel id="Category">Select a Category</InputLabel>
                    <Select
                      labelId="Category"
                      input={<OutlinedInput label="Select a Category" />}
                      value={selectedCategory?.id || ""}
                      onChange={handleOptionCategoryChange}
                    >
                      {categories.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedCategory && subCategories[selectedCategory?.id] && (
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                      <InputLabel id="Category">
                        Select a Sub-Category
                      </InputLabel>
                      <Select
                        labelId="Sub-Category"
                        input={<OutlinedInput label="Select a Sub-Category" />}
                        value={selectedSubCategory?.id || ""}
                        onChange={e =>
                          handleOptionSubCategoryChange(
                            e,
                            subCategories[selectedCategory?.id]
                          )
                        }
                      >
                        {subCategories[selectedCategory.id].map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
                    <InputLabel id="Rating">Select a Rating</InputLabel>
                    <Select
                      labelId="Rating"
                      input={<OutlinedInput label="Select a Rating" />}
                      value={selectedRating?.id || ""}
                      onChange={handleOptionRatingChange}
                    >
                      {ratings.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {step === "playlist" && (
                <CrowdfundActionButton
                  variant="contained"
                  onClick={() => {
                    // publishQDNResource();
                    // setIsOpenMultiplePublish(true)
                    setStep("videos");
                  }}
                >
                  Back
                </CrowdfundActionButton>
              )}
              {step === "playlist" ? (
                <CrowdfundActionButton
                  variant="contained"
                  onClick={() => {
                    publishQDNResource();
                  }}
                >
                  Publish
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
                    ? "Generating image extracts"
                    : ""}
                  {files?.length !== Object.keys(imageExtracts)?.length && (
                    <CircularProgress color="secondary" size={14} />
                  )}
                  Next
                </CrowdfundActionButton>
              )}
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
            setIsOpen(false);
            setImageExtracts({});
            setFiles([]);
            setStep("videos");
            setPlaylistCoverImage(null);
            setPlaylistTitle("");
            setPlaylistDescription("");
            setSelectedCategory(null);
            setCoverImageForAll(null);
            setSelectedSubCategory(null);
            setSelectedRating(null);
            setSelectedCategoryVideos(null);
            setSelectedSubCategoryVideos(null);
            setSelectedRatingVideos(null);
            setPlaylistSetting(null);
            dispatch(
              setNotification({
                msg: "Videos published",
                alertType: "success",
              })
            );
          }}
          publishes={publishes}
        />
      )}
    </>
  );
};
