import { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { categories } from '../../../../constants/Categories.ts';
import { titleFormatter } from '../../../../constants/Misc.ts';
import { VideoFile } from './useVideoUpload.tsx';

export interface UseVideoFormReturn {
  titlesPrefix: string;
  setTitlesPrefix: React.Dispatch<React.SetStateAction<string>>;
  isCheckTitleByFile: boolean;
  setIsCheckTitleByFile: React.Dispatch<React.SetStateAction<boolean>>;
  isCheckSameCoverImage: boolean;
  setIsCheckSameCoverImage: React.Dispatch<React.SetStateAction<boolean>>;
  coverImageForAll: string | null;
  setCoverImageForAll: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategoryVideos: any;
  setSelectedCategoryVideos: React.Dispatch<React.SetStateAction<any>>;
  selectedSubCategoryVideos: any;
  setSelectedSubCategoryVideos: React.Dispatch<React.SetStateAction<any>>;
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
}

export const useVideoForm = (): UseVideoFormReturn => {
  const [titlesPrefix, setTitlesPrefix] = useState('');
  const [isCheckTitleByFile, setIsCheckTitleByFile] = useState(true);
  const [isCheckSameCoverImage, setIsCheckSameCoverImage] = useState(true);
  const [coverImageForAll, setCoverImageForAll] = useState<null | string>('');
  const [selectedCategoryVideos, setSelectedCategoryVideos] =
    useState<any>(null);
  const [selectedSubCategoryVideos, setSelectedSubCategoryVideos] =
    useState<any>(null);

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

  return {
    titlesPrefix,
    setTitlesPrefix,
    isCheckTitleByFile,
    setIsCheckTitleByFile,
    isCheckSameCoverImage,
    setIsCheckSameCoverImage,
    coverImageForAll,
    setCoverImageForAll,
    selectedCategoryVideos,
    setSelectedCategoryVideos,
    selectedSubCategoryVideos,
    setSelectedSubCategoryVideos,
    handleOnchange,
    handleOptionCategoryChangeVideos,
    handleOptionSubCategoryChangeVideos,
  };
};
