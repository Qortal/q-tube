import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../../../constants/Categories.ts";
import { changeFilterType } from "../../../state/features/persistSlice.ts";
import {
  changefilterName,
  changefilterSearch,
  changeSelectedCategoryVideos,
  changeSelectedSubCategoryVideos,
  resetVideoState,
} from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";

export const useSidebarState = (

) => {
  const [filterStateSearch, setFilterStateSearch] = useState('')
  const [filterStateType, setFilterStateType] = useState('videos')
  const [filterStateName, setFilterStateName] = useState('')
  const [selectedCategoryVideosState, setSelectedCategoryVideosState] = useState(null)
  const [selectedSubCategoryVideosState, setSelectedSubCategoryVideosState] = useState(null)

  const dispatch = useDispatch();

  const onSearch = ()=> {
    dispatch(changeFilterType(filterStateType));
    dispatch(changefilterSearch(filterStateSearch));
    dispatch(changefilterName(filterStateName));
    dispatch(changeSelectedCategoryVideos(selectedCategoryVideosState));
    dispatch(changeSelectedSubCategoryVideos(selectedSubCategoryVideosState));
  }

  const {
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    filterName,
    filterSearch
  } = useSelector((state: RootState) => state.video);
  const filterType = useSelector(
    (state: RootState) => state.persist.filterType
  );

  console.log('filterName', filterName, )

useEffect(()=> {
    setFilterStateSearch(filterSearch)
    setFilterStateName(filterName)
    setFilterStateType(filterType)
    setSelectedCategoryVideosState(selectedCategoryVideos)
    setSelectedSubCategoryVideosState(selectedSubCategoryVideos)
}, [filterName,
  filterSearch, filterType, selectedCategoryVideos, selectedSubCategoryVideos])

  const onReset = ()=> {
    dispatch(resetVideoState())
  }

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  console.log('filterType', filterType)

 

  const handleOptionCategoryChangeVideos = (
    event: SelectChangeEvent<string>
  ) => {
    const optionId = event.target.value;
    const selectedOption = categories.find(option => option.id === +optionId);
    setSelectedCategoryVideosState(selectedOption || null);
  };
  const handleOptionSubCategoryChangeVideos = (
    event: SelectChangeEvent<string>,
    subcategories: any[]
  ) => {
    const optionId = event.target.value;
    const selectedOption = subcategories.find(
      option => option.id === +optionId
    );
    setSelectedSubCategoryVideosState(selectedOption || null);
  };



  return {
    filterSearch: filterStateSearch,
    setFilterSearch: setFilterStateSearch,
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
    onReset
  };
};
