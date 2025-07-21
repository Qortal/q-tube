import { SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { categories } from '../../../constants/Categories.ts';
import { usePersistedState } from '../../../state/persist/persist.ts';
import { useAuth } from 'qapp-core';
import { useSearchParams } from 'react-router-dom';

export const useSidebarState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query'); // "example"
  const { isLoadingUser } = useAuth();
  const [filterType, setFilterType, isHydratedFilterState] = usePersistedState(
    'filterType',
    'videos'
  );
  const [filterSearch, setFilterSearch, isHydratedFilterSearch] =
    usePersistedState('filterSearch', '');

  const [filterName, setFilterName, isHydratedFilterName] = usePersistedState(
    'filterName',
    ''
  );
  const [filterCategory, setFilterCategory, isHydratedFilterCategory] =
    usePersistedState('filterCategory', '');
  const [filterSubCategory, setFilterSubCategory, isHydratedFilterSubCategory] =
    usePersistedState('filterSubCategory', '');
  const isHydrated =
    isHydratedFilterState &&
    isHydratedFilterSearch &&
    isHydratedFilterName &&
    isHydratedFilterCategory &&
    isHydratedFilterSubCategory &&
    !isLoadingUser;

  const [filterStateSearch, setFilterStateSearch] = useState('');
  const [filterStateType, setFilterStateType] = useState('videos');
  const [filterStateName, setFilterStateName] = useState('');
  const [selectedCategoryVideosState, setSelectedCategoryVideosState] =
    useState(null);
  const [selectedSubCategoryVideosState, setSelectedSubCategoryVideosState] =
    useState(null);

  const onSearch = (term?: string) => {
    setFilterType(filterStateType);
    setFilterSearch(term || filterStateSearch);
    setFilterName(filterStateName);
    setFilterCategory(selectedCategoryVideosState);
    setFilterSubCategory(selectedSubCategoryVideosState);
  };

  useEffect(() => {
    if (!isHydrated) return;
    setFilterStateSearch(filterSearch || '');
    setFilterStateName(filterName);
    setFilterStateType(filterType);
    setSelectedCategoryVideosState(filterCategory);
    setSelectedSubCategoryVideosState(filterSubCategory);
  }, [
    filterName,
    filterSearch,
    filterType,
    filterCategory,
    filterSubCategory,
    isHydrated,
  ]);

  const onReset = () => {
    setFilterSearch('');
    setFilterName('');
    setFilterCategory('');
    setFilterSubCategory('');
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const handleOptionCategoryChangeVideos = (
    event: SelectChangeEvent<string>
  ) => {
    const optionId = event.target.value;
    const selectedOption = categories.find((option) => option.id === +optionId);
    setSelectedCategoryVideosState(selectedOption || null);
  };
  const handleOptionSubCategoryChangeVideos = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      (option) => option.id === +optionId
    );
    setSelectedSubCategoryVideosState(selectedOption || null);
  };

  return {
    filterSearch: filterStateSearch,
    setFilterSearch: setFilterStateSearch,
    setFilterSearchGlobal: setFilterSearch,
    handleInputKeyDown,
    filterName: filterStateName,
    setFilterName: setFilterStateName,
    selectedCategoryVideos: selectedCategoryVideosState,
    handleOptionCategoryChangeVideos,
    selectedSubCategoryVideos: selectedSubCategoryVideosState,
    handleOptionSubCategoryChangeVideos,
    filterType: filterStateType,
    setFilterType: setFilterStateType,
    onSearch,
    onReset,
    filterSearchGlobal: filterSearch,
  };
};
