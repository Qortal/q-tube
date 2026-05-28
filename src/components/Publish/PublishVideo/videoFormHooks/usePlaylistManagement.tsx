import { useState } from 'react';
import { QTUBE_PLAYLIST_BASE } from '../../../../constants/Identifiers.ts';
import { titleFormatter } from '../../../../constants/Misc.ts';
import { SearchResourcesResponse } from '../../../../utils/qortalRequestTypes.ts';

export interface UsePlaylistManagementReturn {
  playlistSetting: string | null;
  setPlaylistSetting: React.Dispatch<React.SetStateAction<string | null>>;
  playlistTitle: string;
  setPlaylistTitle: React.Dispatch<React.SetStateAction<string>>;
  playlistDescription: string;
  setPlaylistDescription: React.Dispatch<React.SetStateAction<string>>;
  playlistCoverImage: string | null;
  setPlaylistCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  selectedCategory: any;
  setSelectedCategory: React.Dispatch<React.SetStateAction<any>>;
  selectedSubCategory: any;
  setSelectedSubCategory: React.Dispatch<React.SetStateAction<any>>;
  selectExistingPlaylist: any;
  setSelectExistingPlaylist: React.Dispatch<React.SetStateAction<any>>;
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any>>;
  filterSearch: string;
  setFilterSearch: React.Dispatch<React.SetStateAction<string>>;
  search: () => Promise<void>;
  handlePlaylistTitleChange: (value: string) => void;
}

export const usePlaylistManagement = (
  username: string
): UsePlaylistManagementReturn => {
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
  const [searchResults, setSearchResults] = useState<SearchResourcesResponse[]>(
    []
  );
  const [filterSearch, setFilterSearch] = useState<string>('');

  const search = async () => {
    try {
      const responseDataSearchVid = await qortalRequest({
        action: 'SEARCH_QDN_RESOURCES',
        mode: 'ALL',
        service: 'PLAYLIST',
        identifier: QTUBE_PLAYLIST_BASE,
        title: filterSearch,
        limit: 20,
        includeMetadata: true,
        reverse: true,
        name: username,
        exactMatchNames: true,
        offset: 0,
      });

      setSearchResults(responseDataSearchVid);
    } catch (error) {
      console.error('DEBUG: Error during playlist search:', error);
    }
  };

  const handlePlaylistTitleChange = (value: string) => {
    let formattedValue: string = value;
    formattedValue = value.replace(titleFormatter, '');
    setPlaylistTitle(formattedValue);
  };

  return {
    playlistSetting,
    setPlaylistSetting,
    playlistTitle,
    setPlaylistTitle,
    playlistDescription,
    setPlaylistDescription,
    playlistCoverImage,
    setPlaylistCoverImage,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectExistingPlaylist,
    setSelectExistingPlaylist,
    searchResults,
    setSearchResults,
    filterSearch,
    setFilterSearch,
    search,
    handlePlaylistTitleChange,
  };
};
