import { SelectChangeEvent } from "@mui/material";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../../../constants/Categories.ts";
import { changeFilterType } from "../../../state/features/persistSlice.ts";
import {
  changefilterName,
  changefilterSearch,
  changeSelectedCategoryVideos,
  changeSelectedSubCategoryVideos,
} from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";

export const useSidebarState = (
  onSearch: (reset?: boolean, resetFilters?: boolean) => void
) => {
  const dispatch = useDispatch();

  const {
    filterSearch,
    filterName,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
  } = useSelector((state: RootState) => state.video);

  const filterType = useSelector(
    (state: RootState) => state.persist.filterType
  );

  const setFilterType = payload => {
    dispatch(changeFilterType(payload));
  };

  const setFilterSearch = payload => {
    dispatch(changefilterSearch(payload));
  };

  const setFilterName = payload => {
    dispatch(changefilterName(payload));
  };
  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter") {
      onSearch(true);
    }
  };

  const filtersToDefault = async () => {
    setFilterSearch("");
    setFilterName("");
    setSelectedCategoryVideos(null);
    setSelectedSubCategoryVideos(null);

    ReactDOM.flushSync(() => {
      onSearch(true, true);
    });
  };

  const setSelectedCategoryVideos = payload => {
    dispatch(changeSelectedCategoryVideos(payload));
  };

  const setSelectedSubCategoryVideos = payload => {
    dispatch(changeSelectedSubCategoryVideos(payload));
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

  useEffect(() => {
    // Makes displayed videos reload when switching filter type. Removes need to click Search button after changing type
    onSearch(true);
  }, [filterType]);

  return {
    filterSearch,
    setFilterSearch,
    handleInputKeyDown,
    filterName,
    setFilterName,
    selectedCategoryVideos,
    handleOptionCategoryChangeVideos,
    selectedSubCategoryVideos,
    handleOptionSubCategoryChangeVideos,
    filterType,
    setFilterType,
    filtersToDefault,
  };
};
