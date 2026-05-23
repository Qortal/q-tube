import { objectToBase64, useAuth, useGlobal, usePublish } from 'qapp-core';
import { useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from '../../../../constants/Identifiers.ts';
import { extractTextFromHTML } from '../../../common/TextEditor/utils.ts';
import { VideoFile } from './useVideoUpload.tsx';

const uid = new ShortUniqueId();
const shortuid = new ShortUniqueId({ length: 5 });

export interface UseQDNPublishingReturn {
  publishes: any;
  setPublishes: React.Dispatch<React.SetStateAction<any>>;
  isOpenMultiplePublish: boolean;
  setIsOpenMultiplePublish: React.Dispatch<React.SetStateAction<boolean>>;
  publishQDNResource: (
    files: VideoFile[],
    videoDurations: number[],
    imageExtracts: any,
    playlistSetting: string | null,
    playlistTitle: string,
    playlistDescription: string,
    playlistCoverImage: string | null,
    selectedCategory: any,
    selectedSubCategory: any,
    selectedCategoryVideos: any,
    selectedSubCategoryVideos: any,
    coverImageForAll: string | null,
    isCheckSameCoverImage: boolean,
    selectExistingPlaylist: any,
    editId?: string,
    editContent?: null | {
      title: string;
      user: string;
      coverImage: string | null;
    }
  ) => Promise<void>;
  next: (
    files: VideoFile[],
    isCheckSameCoverImage: boolean,
    coverImageForAll: string | null,
    selectedCategoryVideos: any,
    isCheckTitleByFile: boolean,
    setStep: (step: string) => void
  ) => void;
}

export const useQDNPublishing = (
  setNotification: (notification: any) => void,
  onClose: () => void
): UseQDNPublishingReturn => {
  const [publishes, setPublishes] = useState<any>(null);
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const publishFromLibrary = usePublish();
  const { lists } = useGlobal();
  const { name: username, address: userAddress } = useAuth();

  const publishQDNResource = async (
    files: VideoFile[],
    videoDurations: number[],
    imageExtracts: any,
    playlistSetting: string | null,
    playlistTitle: string,
    playlistDescription: string,
    playlistCoverImage: string | null,
    selectedCategory: any,
    selectedSubCategory: any,
    selectedCategoryVideos: any,
    selectedSubCategoryVideos: any,
    coverImageForAll: string | null,
    isCheckSameCoverImage: boolean,
    selectExistingPlaylist: any,
    editId?: string,
    editContent?: null | {
      title: string;
      user: string;
      coverImage: string | null;
    }
  ) => {
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
        const notificationObj = {
          msg: errorMsg,
          alertType: 'error' as any,
        };
        setNotification(notificationObj);
        return;
      }

      const listOfPublishes: any[] = [];
      const tempResourcesForList: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const publish = files[i];
        const title = publish.title;
        const description = publish.description;
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

        console.log('Video Metadata: ', videoObject);

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
          filename: file.name,
          tag1: QTUBE_VIDEO_BASE,
        };
        listOfPublishes.push(requestBodyJson);
        listOfPublishes.push(requestBodyVideo);
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
        console.log('New Playlist: ', playlistObject);
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
        const responseData = await (window as any).qortalRequest({
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
          console.log('Playlist: ', playlistObject);
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
      setNotification(notificationObj);

      throw new Error('Failed to publish video');
    }
  };

  const next = (
    files: VideoFile[],
    isCheckSameCoverImage: boolean,
    coverImageForAll: string | null,
    selectedCategoryVideos: any,
    isCheckTitleByFile: boolean,
    setStep: (step: string) => void
  ) => {
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
      const notificationObj = {
        msg: message,
        alertType: 'error' as any,
      };
      setNotification(notificationObj);
    }
  };

  return {
    publishes,
    setPublishes,
    isOpenMultiplePublish,
    setIsOpenMultiplePublish,
    publishQDNResource,
    next,
  };
};
