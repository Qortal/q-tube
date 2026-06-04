import { SelectChangeEvent } from '@mui/material';
import Compressor from 'compressorjs';
import {
  objectToBase64,
  showError,
  useAuth,
  useGlobal,
  usePublish,
} from 'qapp-core';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ShortUniqueId from 'short-unique-id';
import { categories } from '../../../../constants/Categories.ts';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../../../constants/Identifiers.ts';
import { maxSize, titleFormatter } from '../../../../constants/Misc.ts';
import { useMediaInfo } from '../../../../hooks/useMediaInfo.tsx';
import {
  getFileExtension,
  getFileName,
  processFilename,
} from '../../../../utils/stringFunctions.ts';
import { extractTextFromHTML } from '../../../common/TextEditor/utils.ts';

const uid = new ShortUniqueId();
const shortuid = new ShortUniqueId({ length: 5 });

export interface VideoFile {
  file: File | null;
  title: string;
  description: string;
  coverImage?: string;
}

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => {
      reject(error);
    };
  });

export interface UseVideoPublishingWorkflowReturn {
  // Workflow state
  step: string;
  isOpen: boolean;

  // Video upload state
  files: VideoFile[];
  videoDurations: number[];
  imageExtracts: any;

  // Form state
  titlesPrefix: string;
  isCheckTitleByFile: boolean;
  isCheckSameCoverImage: boolean;
  coverImageForAll: string | null;
  selectedCategoryVideos: any;
  selectedSubCategoryVideos: any;
  isValidQortalLink: boolean;
  publishMethod: string;
  isQortalLinkEmpty: boolean;
  fetchedVideoData: any;
  videoTitle: string;
  videoReference: any;
  isVideoDownloading: boolean;

  // Playlist state
  playlistSetting: string | null;
  playlistTitle: string;
  playlistDescription: string;
  playlistCoverImage: string | null;
  selectedCategory: any;
  selectedSubCategory: any;
  selectExistingPlaylist: any;
  searchResults: any[];
  filterSearch: string;

  // Publishing state
  publishes: any;
  isOpenMultiplePublish: boolean;

  // Actions
  openModal: () => void;
  onClose: () => void;
  setStep: (step: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetWorkflow: () => void;

  // Video upload actions
  getRootProps: any;
  getInputProps: any;
  setFiles: React.Dispatch<React.SetStateAction<VideoFile[]>>;
  setVideoDurations: React.Dispatch<React.SetStateAction<number[]>>;
  setImageExtracts: React.Dispatch<React.SetStateAction<any>>;
  assembleVideoDurations: () => void;
  onFramesExtracted: (imgs: any[], index: number) => Promise<void>;

  // Form actions
  setTitlesPrefix: React.Dispatch<React.SetStateAction<string>>;
  setIsCheckTitleByFile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCheckSameCoverImage: React.Dispatch<React.SetStateAction<boolean>>;
  setCoverImageForAll: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCategoryVideos: React.Dispatch<React.SetStateAction<any>>;
  setSelectedSubCategoryVideos: React.Dispatch<React.SetStateAction<any>>;
  setIsValidQortalLink: React.Dispatch<React.SetStateAction<boolean>>;
  setPublishMethod: React.Dispatch<React.SetStateAction<string>>;
  setIsQortalLinkEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchedVideoData: React.Dispatch<React.SetStateAction<any>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setVideoReference: React.Dispatch<React.SetStateAction<any>>;
  setIsVideoDownloading: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnchange: (
    index: number,
    type: string,
    value: string,
    setFiles: React.Dispatch<React.SetStateAction<VideoFile[]>>
  ) => void;
  handleOptionCategoryChangeVideos: (event: SelectChangeEvent<string>) => void;
  handleOptionSubCategoryChangeVideos: (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => void;

  // Playlist actions
  setPlaylistSetting: React.Dispatch<React.SetStateAction<string | null>>;
  setPlaylistTitle: React.Dispatch<React.SetStateAction<string>>;
  setPlaylistDescription: React.Dispatch<React.SetStateAction<string>>;
  setPlaylistCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<any>>;
  setSelectedSubCategory: React.Dispatch<React.SetStateAction<any>>;
  setSelectExistingPlaylist: React.Dispatch<React.SetStateAction<any>>;
  setSearchResults: React.Dispatch<React.SetStateAction<any>>;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  search: () => Promise<void>;
  handlePlaylistTitleChange: (value: string) => void;

  // Publishing actions
  setPublishes: React.Dispatch<React.SetStateAction<any>>;
  setIsOpenMultiplePublish: React.Dispatch<React.SetStateAction<boolean>>;
  publishQDNResource: (
    files?: VideoFile[],
    videoDurations?: number[],
    imageExtracts?: any,
    playlistSetting?: string | null,
    playlistTitle?: string,
    playlistDescription?: string,
    playlistCoverImage?: string | null,
    selectedCategory?: any,
    selectedSubCategory?: any,
    selectedCategoryVideos?: any,
    selectedSubCategoryVideos?: any,
    coverImageForAll?: string | null,
    isCheckSameCoverImage?: boolean,
    selectExistingPlaylist?: any,
    editId?: string,
    editContent?: null | {
      title: string;
      user: string;
      coverImage: string | null;
    }
  ) => Promise<void>;
  next: (
    files?: VideoFile[],
    isCheckSameCoverImage?: boolean,
    coverImageForAll?: string | null,
    selectedCategoryVideos?: any,
    isCheckTitleByFile?: boolean,
    setStep?: (step: string) => void,
    isValidQortalLink?: boolean,
    publishMethod?: string
  ) => void;
}

export const useVideoPublishingWorkflow = (
  setNotification: (notification: any) => void,
  afterClose?: () => void
): UseVideoPublishingWorkflowReturn => {
  // Workflow state
  const [step, setStep] = useState<string>('videos');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Video upload state
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [imageExtracts, setImageExtracts] = useState<any>({});

  // Form state
  const [titlesPrefix, setTitlesPrefix] = useState('');
  const [isCheckTitleByFile, setIsCheckTitleByFile] = useState(true);
  const [isCheckSameCoverImage, setIsCheckSameCoverImage] = useState(true);
  const [coverImageForAll, setCoverImageForAll] = useState<null | string>('');
  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);
  const [isValidQortalLink, setIsValidQortalLink] = useState(false);
  const [publishMethod, setPublishMethod] = useState('files');
  const [isQortalLinkEmpty, setIsQortalLinkEmpty] = useState(true);
  const [fetchedVideoData, setFetchedVideoData] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoReference, setVideoReference] = useState<any>(null);
  const [isVideoDownloading, setIsVideoDownloading] = useState<boolean>(false);

  // Playlist state
  const [playlistSetting, setPlaylistSetting] = useState<null | string>(null);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [playlistDescription, setPlaylistDescription] = useState<string>('');
  const [playlistCoverImage, setPlaylistCoverImage] = useState<null | string>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectExistingPlaylist, setSelectExistingPlaylist] =
    useState<any>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [filterSearch, setFilterSearch] = useState('');

  // Publishing state
  const [publishes, setPublishes] = useState<any>(null);
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);

  // External hooks
  const { isHEVC } = useMediaInfo();
  const publishFromLibrary = usePublish();
  const { lists } = useGlobal();
  const { name: username, address: userAddress } = useAuth();

  // Workflow actions
  const onClose = () => {
    setIsOpen(false);
    if (afterClose) afterClose();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const resetWorkflow = () => {
    setStep('videos');
    setIsOpen(false);
  };

  // Video upload actions
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
    onDrop: async (acceptedFiles, rejectedFiles) => {
      const formattedFiles: VideoFile[] = [];

      for (const file of acceptedFiles) {
        let filteredTitle = '';

        if (isCheckTitleByFile) {
          const fileName = getFileName(file?.name || '');
          filteredTitle = (titlesPrefix + fileName).replace(titleFormatter, '');
        }

        const notSupportedCodec = await isHEVC(file);

        const isMKV = getFileExtension(file) === 'mkv';
        const isUnsupportedFile = notSupportedCodec || isMKV;

        if (isUnsupportedFile) {
          if (notSupportedCodec)
            showError(`${file.name} uses the unsupported encoding: HEVC`);
          if (isMKV)
            showError(`${file.name} uses the unsupported file container: MKV`);
          continue;
        }
        formattedFiles.push({
          file,
          title: filteredTitle || '',
          description: '',
          coverImage: '',
        });
      }

      setFiles((prev) => [...prev, ...formattedFiles]);

      let errorString: string | null = null;
      for (const { file, errors } of rejectedFiles) {
        for (const error of errors) {
          if (error.code === 'file-too-large') {
            errorString = `File must be under 100MB`;
          }
          console.error(`Error with file ${file.name}: ${error.message}`);
        }
      }

      if (errorString) {
        const notificationObj = {
          msg: errorString,
          alertType: 'error' as any,
        };
        setNotification(notificationObj);
      }
    },
  });

  const onFramesExtracted = async (imgs: any[], index: number) => {
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

  // Form actions
  const handleOnchange = (
    index: number,
    type: string,
    value: string,
    setFiles: React.Dispatch<React.SetStateAction<VideoFile[]>>
  ) => {
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

  // Playlist actions
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

  const handlePlaylistTitleChange = (value: string) => {
    let formattedValue: string = value;
    formattedValue = value.replace(titleFormatter, '');
    setPlaylistTitle(formattedValue);
  };

  const publishVideoToQDN = async (
    filesParam?: VideoFile[],
    videoDurationsParam?: number[],
    imageExtractsParam?: any,
    playlistSettingParam?: string | null,
    playlistTitleParam?: string,
    playlistDescriptionParam?: string,
    playlistCoverImageParam?: string | null,
    selectedCategoryParam?: any,
    selectedSubCategoryParam?: any,
    selectedCategoryVideosParam?: any,
    selectedSubCategoryVideosParam?: any,
    coverImageForAllParam?: string | null,
    isCheckSameCoverImageParam?: boolean,
    selectExistingPlaylistParam?: any,
    editId?: string,
    editContent?: null | {
      title: string;
      user: string;
      coverImage: string | null;
    }
  ) => {
    try {
      // Use parameters if provided, otherwise use internal state
      const filesToUse = filesParam || files;
      const videoDurationsToUse = videoDurationsParam || videoDurations;
      const imageExtractsToUse = imageExtractsParam || imageExtracts;
      const playlistSettingToUse = playlistSettingParam || playlistSetting;
      const playlistTitleToUse = playlistTitleParam || playlistTitle;
      const playlistDescriptionToUse =
        playlistDescriptionParam || playlistDescription;
      const playlistCoverImageToUse =
        playlistCoverImageParam || playlistCoverImage;
      const selectedCategoryToUse = selectedCategoryParam || selectedCategory;
      const selectedSubCategoryToUse =
        selectedSubCategoryParam || selectedSubCategory;
      const selectedCategoryVideosToUse =
        selectedCategoryVideosParam || selectedCategoryVideos;
      const selectedSubCategoryVideosToUse =
        selectedSubCategoryVideosParam || selectedSubCategoryVideos;
      const coverImageForAllToUse = coverImageForAllParam || coverImageForAll;
      const isCheckSameCoverImageToUse =
        isCheckSameCoverImageParam !== undefined
          ? isCheckSameCoverImageParam
          : isCheckSameCoverImage;
      const selectExistingPlaylistToUse =
        selectExistingPlaylistParam || selectExistingPlaylist;

      // Validation for new playlist
      if (playlistSettingToUse === 'new') {
        if (!playlistTitleToUse) throw new Error('Please enter a title');
        if (!playlistDescriptionToUse)
          throw new Error('Please enter a description');
        if (!playlistCoverImageToUse)
          throw new Error('Please select cover image');
        if (!selectedCategoryToUse) throw new Error('Please select a category');
      }

      // General validation
      if (publishMethod === 'files' && filesToUse?.length === 0)
        throw new Error('Please select at least one file');
      if (publishMethod === 'qortal' && !videoReference)
        throw new Error('Please select a video reference');
      if (isCheckSameCoverImageToUse && !coverImageForAllToUse)
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
        const notificationObj = {
          msg: errorMsg,
          alertType: 'error' as any,
        };
        setNotification(notificationObj);
        return;
      }

      const listOfPublishes: any[] = [];
      const tempResourcesForList: any[] = [];

      // Create a mock file array for video reference publishing
      let filesToProcess = filesToUse;
      if (
        publishMethod === 'qortal' &&
        videoReference &&
        filesToUse.length === 0
      ) {
        filesToProcess = [
          {
            file: null,
            title: videoTitle || videoReference?.title || videoReference?.name || '',
            description: '',
            coverImage: '',
          },
        ];
      }

      // Process each video file
      for (let i = 0; i < filesToProcess.length; i++) {
        const publish = filesToProcess[i];
        const title = publish.title;
        const description = publish.description;
        const category = selectedCategoryVideosToUse.id;
        const subcategory = selectedSubCategoryVideosToUse?.id || '';
        const coverImage = isCheckSameCoverImageToUse
          ? coverImageForAllToUse
          : publish.coverImage;
        const file = publish.file;
        const sanitizeTitle = (title || '')
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
        if (file) {
          const fileExtensionSplit = file.name.split('.');
          if (fileExtensionSplit && fileExtensionSplit.length > 1) {
            fileExtension = fileExtensionSplit.pop() || 'mp4';
          }
        } else if (videoReference) {
          // Use the file extension from the video reference if available
          const videoRefName = videoReference.name || '';
          const fileExtensionSplit = videoRefName.split('.');
          if (fileExtensionSplit && fileExtensionSplit.length > 1) {
            fileExtension = fileExtensionSplit.pop() || 'mp4';
          }
        }

        const alphanumericString = processFilename(title || videoReference?.title || videoReference?.name || '');

        const videoObject: any = {
          title,
          version: 1,
          fullDescription,
          htmlDescription: description,
          videoImage: coverImage,
          videoReference: videoReference
            ? {
                name: videoReference.name,
                identifier: videoReference.identifier,
                service: videoReference.service,
              }
            : {
                name,
                identifier: identifier,
                service: 'VIDEO',
              },
          extracts: imageExtractsToUse[i],
          commentsId: `${QTUBE_VIDEO_BASE}_cm_${id}`,
          category,
          subcategory,
          code,
          videoType: file?.type || 'video/mp4',
          filename: `${alphanumericString.trim()}.${fileExtension}`,
          fileSize: videoReference?.size || file?.size || 0,
          duration: videoDurationsToUse[i],
        };

        const metadescription =
          `**category:${category};subcategory:${subcategory};code:${code}**` +
          fullDescription.slice(0, 150);

        // Log video metadata before serialization
        console.log('Video Metadata: ', videoObject);

        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: name,
          service: 'DOCUMENT',
          data64: await objectToBase64(videoObject),
          title: (title || '').slice(0, 50),
          description: metadescription,
          identifier: identifier + '_metadata',
          tag1: QTUBE_VIDEO_BASE,
          filename: `video_metadata.json`,
          code,
        };

        listOfPublishes.push(requestBodyJson);

        // Only add VIDEO service publish if not using video reference
        if (!videoReference && file) {
          const requestBodyVideo: any = {
            action: 'PUBLISH_QDN_RESOURCE',
            name: name,
            service: 'VIDEO',
            file,
            title: (title || '').slice(0, 50),
            description: metadescription,
            identifier,
            filename: file.name,
            tag1: QTUBE_VIDEO_BASE,
          };

          listOfPublishes.push(requestBodyVideo);
        }
        tempResourcesForList.push({
          qortalMetadata: {
            identifier: identifier + '_metadata',
            name: name,
            service: 'DOCUMENT',
            size: 1000,
            created: Date.now(),
          },
          data: videoObject,
        });
      }

      // Handle playlist creation or update
      const isNewPlaylist = playlistSettingToUse === 'new';

      if (isNewPlaylist) {
        const title = playlistTitleToUse;
        const description = playlistDescriptionToUse;
        const stringDescription = extractTextFromHTML(description);
        const category = selectedCategoryToUse.id;
        const subcategory = selectedSubCategoryToUse?.id || '';
        const coverImage = playlistCoverImageToUse;
        const sanitizeTitle = (title || '')
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

        // Log new playlist metadata before serialization
        console.log('New Playlist: ', playlistObject);

        // Description is obtained from raw data
        const requestBodyJson: any = {
          action: 'PUBLISH_QDN_RESOURCE',
          name: name,
          service: 'PLAYLIST',
          data64: await objectToBase64(playlistObject),
          title: (title || '').slice(0, 50),
          description: metadescription,
          identifier: identifier + '_metadata',
          tag1: QTUBE_VIDEO_BASE,
        };

        listOfPublishes.push(requestBodyJson);
      } else if (playlistSettingToUse === 'existing') {
        if (!selectExistingPlaylistToUse) {
          throw new Error('select a playlist');
        }

        // get raw data for playlist
        const responseData = await qortalRequest({
          action: 'FETCH_QDN_RESOURCE',
          name: selectExistingPlaylistToUse.name,
          service: selectExistingPlaylistToUse.service,
          identifier: selectExistingPlaylistToUse.identifier,
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

          // Log updated playlist metadata before serialization
          console.log('Existing Playlist Updated: ', playlistObject);

          // Description is obtained from raw data
          const requestBodyJson: any = {
            action: 'PUBLISH_QDN_RESOURCE',
            name: name,
            service: 'PLAYLIST',
            data64: await objectToBase64(playlistObject),
            title: (playlistObject.title || '').slice(0, 50),
            description: metadescription,
            identifier: selectExistingPlaylistToUse.identifier,
            tag1: QTUBE_VIDEO_BASE,
          };

          listOfPublishes.push(requestBodyJson);
        } else {
          throw new Error('cannot get playlist data');
        }
      }

      await publishFromLibrary.publishMultipleResources(listOfPublishes);
      lists.addNewResources('latestVideos', tempResourcesForList);
      const notificationObj = {
        msg: 'Video published',
        alertType: 'success' as any,
      };
      setNotification(notificationObj);
      onClose();
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Failed to publish video';
      const notificationObj = {
        msg: message,
        alertType: 'error',
      };
      console.log(error);
      setNotification(notificationObj);
    }
  };

  const next = (
    filesParam?: VideoFile[],
    isCheckSameCoverImageParam?: boolean,
    coverImageForAllParam?: string | null,
    selectedCategoryVideosParam?: any,
    isCheckTitleByFileParam?: boolean,
    setStepParam?: (step: string) => void,
    isValidQortalLinkParam?: boolean,
    publishMethodParam?: string
  ) => {
    try {
      // Use parameters if provided, otherwise use internal state
      const filesToUse = filesParam || files;
      const isCheckSameCoverImageToUse =
        isCheckSameCoverImageParam !== undefined
          ? isCheckSameCoverImageParam
          : isCheckSameCoverImage;
      const coverImageForAllToUse = coverImageForAllParam || coverImageForAll;
      const selectedCategoryVideosToUse =
        selectedCategoryVideosParam || selectedCategoryVideos;
      const isCheckTitleByFileToUse =
        isCheckTitleByFileParam !== undefined
          ? isCheckTitleByFileParam
          : isCheckTitleByFile;
      const setStepToUse = setStepParam || setStep;
      const isValidQortalLinkToUse =
        isValidQortalLinkParam !== undefined
          ? isValidQortalLinkParam
          : isValidQortalLink;
      const publishMethodToUse =
        publishMethodParam !== undefined ? publishMethodParam : publishMethod;

      // Check validation based on publish method
      if (publishMethodToUse === 'files') {
        if (filesToUse?.length === 0) {
          throw new Error('Please select at least one file');
        }
      } else if (publishMethodToUse === 'qortal') {
        if (!videoReference) {
          throw new Error('Please select a video reference');
        }
        if (isVideoDownloading) {
          throw new Error('Video is still downloading');
        }
      }

      if (isCheckSameCoverImageToUse && !coverImageForAllToUse)
        throw new Error('Please select cover image');
      if (!selectedCategoryVideosToUse)
        throw new Error('Please select a category');
      filesToUse?.forEach((file) => {
        // For video reference publishing, check videoTitle instead of file.title
        if (publishMethodToUse === 'qortal' && videoReference) {
          if (!videoTitle) throw new Error('Please enter a title');
          if (!isCheckTitleByFileToUse && !file.description)
            throw new Error('Please enter a description');
          if (!isCheckSameCoverImageToUse && !file.coverImage)
            throw new Error('Please select cover image');
        } else {
          // For file publishing, use the original validation
          if (!file.title) throw new Error('Please enter a title');
          if (!isCheckTitleByFileToUse && !file.description)
            throw new Error('Please enter a description');
          if (!isCheckSameCoverImageToUse && !file.coverImage)
            throw new Error('Please select cover image');
        }
      });

      setStepToUse('playlist');
    } catch (error) {
      const isError = error instanceof Error;
      const message = isError ? error?.message : 'Please fill out all inputs';
      const notificationObj = {
        msg: message,
        alertType: 'error' as any,
      };
      setNotification(notificationObj);
    }
  };

  return {
    // Workflow state
    step,
    isOpen,

    // Video upload state
    files,
    videoDurations,
    imageExtracts,

    // Form state
    titlesPrefix,
    isCheckTitleByFile,
    isCheckSameCoverImage,
    coverImageForAll,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    isValidQortalLink,
    publishMethod,
    isQortalLinkEmpty,
    fetchedVideoData,
    videoTitle,
    videoReference,
    isVideoDownloading,

    // Playlist state
    playlistSetting,
    playlistTitle,
    playlistDescription,
    playlistCoverImage,
    selectedCategory,
    selectedSubCategory,
    selectExistingPlaylist,
    searchResults,
    filterSearch,

    // Publishing state
    publishes,
    isOpenMultiplePublish,

    // Actions
    openModal,
    onClose,
    setStep,
    setIsOpen,
    resetWorkflow,

    // Video upload actions
    getRootProps,
    getInputProps,
    setFiles,
    setVideoDurations,
    setImageExtracts,
    assembleVideoDurations,
    onFramesExtracted,

    // Form actions
    setTitlesPrefix,
    setIsCheckTitleByFile,
    setIsCheckSameCoverImage,
    setCoverImageForAll,
    setSelectedCategoryVideos,
    setSelectedSubCategoryVideos,
    setIsValidQortalLink,
    setPublishMethod,
    setIsQortalLinkEmpty,
    setFetchedVideoData,
    setVideoTitle,
    setVideoReference,
    setIsVideoDownloading,
    handleOnchange,
    handleOptionCategoryChangeVideos,
    handleOptionSubCategoryChangeVideos,

    // Playlist actions
    setPlaylistSetting,
    setPlaylistTitle,
    setPlaylistDescription,
    setPlaylistCoverImage,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectExistingPlaylist,
    setSearchResults,
    setFilterSearch,
    search,
    handlePlaylistTitleChange,

    // Publishing actions
    setPublishes,
    setIsOpenMultiplePublish,
    publishQDNResource: publishVideoToQDN,
    next,
  };
};
