import Compressor from 'compressorjs';
import { showError } from 'qapp-core';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { maxSize, titleFormatter } from '../../../../constants/Misc.ts';
import { useMediaInfo } from '../../../../hooks/useMediaInfo.tsx';
import {
  getFileExtension,
  getFileName,
} from '../../../../utils/stringFunctions.ts';

export interface VideoFile {
  file: File;
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

export interface UseVideoUploadReturn {
  files: VideoFile[];
  setFiles: React.Dispatch<React.SetStateAction<VideoFile[]>>;
  videoDurations: number[];
  setVideoDurations: React.Dispatch<React.SetStateAction<number[]>>;
  imageExtracts: any;
  setImageExtracts: React.Dispatch<React.SetStateAction<any>>;
  assembleVideoDurations: () => void;
  getRootProps: any;
  getInputProps: any;
  onFramesExtracted: (imgs: any[], index: number) => Promise<void>;
}

export const useVideoUpload = (
  isCheckTitleByFile: boolean,
  titlesPrefix: string,
  setNotification: (notification: any) => void
): UseVideoUploadReturn => {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [imageExtracts, setImageExtracts] = useState<any>({});
  const { isHEVC } = useMediaInfo();

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

  return {
    files,
    setFiles,
    videoDurations,
    setVideoDurations,
    imageExtracts,
    setImageExtracts,
    assembleVideoDurations,
    getRootProps,
    getInputProps,
    onFramesExtracted,
  };
};
