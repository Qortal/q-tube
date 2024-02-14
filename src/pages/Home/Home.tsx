import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Tab,
  useTheme,
} from "@mui/material";
import { useFetchVideos } from "../../hooks/useFetchVideos";
import LazyLoad from "../../components/common/LazyLoad";
import {
  FiltersCol,
  FiltersContainer,
  FiltersRow,
  FiltersSubContainer,
  ProductManagerRow,
  FiltersRadioButton,
} from "./VideoList-styles";
import { SubtitleContainer } from "./Home-styles";

import {
  changeSelectedCategoryVideos,
  changeSelectedSubCategoryVideos,
  changefilterName,
  changefilterSearch,
} from "../../state/features/videoSlice";
import { changeFilterType } from "../../state/features/persistSlice.ts";
import { categories, subCategories } from "../../constants/Categories.ts";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import VideoList from "./VideoList.tsx";
import { allTabValue, subscriptionTabValue } from "../../constants/Misc.ts";
import { setHomePageSelectedTab } from "../../state/features/persistSlice.ts";

interface HomeProps {
  mode?: string;
}
export const Home = ({ mode }: HomeProps) => {
  const prevVal = useRef("");
  const isFiltering = useSelector(
    (state: RootState) => state.video.isFiltering
  );
  const filterValue = useSelector(
    (state: RootState) => state.video.filterValue
  );
  const persistSelector = useSelector((state: RootState) => state.persist);
  const filterType = useSelector(
    (state: RootState) => state.persist.filterType
  );
  const filterSearch = useSelector(
    (state: RootState) => state.video.filterSearch
  );
  const filterName = useSelector((state: RootState) => state.video.filterName);
  const selectedCategoryVideos = useSelector(
    (state: RootState) => state.video.selectedCategoryVideos
  );
  const totalVideosPublished = useSelector(
    (state: RootState) => state.global.totalVideosPublished
  );
  const totalNamesPublished = useSelector(
    (state: RootState) => state.global.totalNamesPublished
  );
  const videosPerNamePublished = useSelector(
    (state: RootState) => state.global.videosPerNamePublished
  );

  const { videos: globalVideos } = useSelector(
    (state: RootState) => state.video
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<string>(persistSelector.selectedTab);

  const tabFontSize = "20px";

  const setFilterType = payload => {
    dispatch(changeFilterType(payload));
  };

  useEffect(() => {
    // Makes displayed videos reload when switching filter type. Removes need to click Search button after changing type
    getVideosHandler(true);
  }, [filterType]);
  const setFilterSearch = payload => {
    dispatch(changefilterSearch(payload));
  };

  const setFilterName = payload => {
    dispatch(changefilterName(payload));
  };

  const setSelectedCategoryVideos = payload => {
    dispatch(changeSelectedCategoryVideos(payload));
  };
  const selectedSubCategoryVideos = useSelector(
    (state: RootState) => state.video.selectedSubCategoryVideos
  );

  const setSelectedSubCategoryVideos = payload => {
    dispatch(changeSelectedSubCategoryVideos(payload));
  };

  const dispatch = useDispatch();
  const filteredVideos = useSelector(
    (state: RootState) => state.video.filteredVideos
  );

  const isFilterMode = useRef(false);
  const firstFetch = useRef(false);
  const afterFetch = useRef(false);
  const isFetching = useRef(false);

  const { getVideos, getNewVideos, checkNewVideos, getVideosFiltered, getVideosCount } =
    useFetchVideos();

  const getVideosHandler = React.useCallback(
    async (reset?: boolean, resetFilters?: boolean) => {
      if (!firstFetch.current || !afterFetch.current) return;
      if (isFetching.current) return;
      isFetching.current = true;
      await getVideos(
        {
          name: filterName,
          category: selectedCategoryVideos?.id,
          subcategory: selectedSubCategoryVideos?.id,
          keywords: filterSearch,
          type: filterType,
        },
        reset,
        resetFilters,
        20,
        tabValue
      );
      isFetching.current = false;
    },
    [
      getVideos,
      filterValue,
      getVideosFiltered,
      isFiltering,
      filterName,
      selectedCategoryVideos,
      selectedSubCategoryVideos,
      filterSearch,
      filterType,
      tabValue,
    ]
  );

  useEffect(() => {
    getVideosCount();
    if (isFiltering && filterValue !== prevVal?.current) {
      prevVal.current = filterValue;
      getVideosHandler();
    }
  }, [filterValue, isFiltering, filteredVideos, getVideosCount]);

  const getVideosHandlerMount = React.useCallback(async () => {
    if (firstFetch.current) return;
    firstFetch.current = true;
    setIsLoading(true);

    await getVideos({ type: filterType }, null, null, 20, tabValue);
    afterFetch.current = true;
    isFetching.current = false;

    setIsLoading(false);
  }, [getVideos]);

  let videos = globalVideos;

  if (isFiltering) {
    videos = filteredVideos;
    isFilterMode.current = true;
  } else {
    isFilterMode.current = false;
  }

  // const interval = useRef<any>(null);

  // const checkNewVideosFunc = useCallback(() => {
  //   let isCalling = false;
  //   interval.current = setInterval(async () => {
  //     if (isCalling || !firstFetch.current) return;
  //     isCalling = true;
  //     await checkNewVideos();
  //     isCalling = false;
  //   }, 30000); // 1 second interval
  // }, [checkNewVideos]);

  // useEffect(() => {
  //   if (isFiltering && interval.current) {
  //     clearInterval(interval.current);
  //     return;
  //   }
  //   checkNewVideosFunc();

  //   return () => {
  //     if (interval?.current) {
  //       clearInterval(interval.current);
  //     }
  //   };
  // }, [mode, checkNewVideosFunc, isFiltering]);

  useEffect(() => {
    if (
      !firstFetch.current &&
      !isFilterMode.current &&
      globalVideos.length === 0
    ) {
      isFetching.current = true;
      getVideosHandlerMount();
    } else {
      firstFetch.current = true;
      afterFetch.current = true;
    }
  }, [getVideosHandlerMount, globalVideos]);

  const filtersToDefault = async () => {
    setFilterType("videos");
    setFilterSearch("");
    setFilterName("");
    setSelectedCategoryVideos(null);
    setSelectedSubCategoryVideos(null);

    ReactDOM.flushSync(() => {
      getVideosHandler(true, true);
    });
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

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter") {
      getVideosHandler(true);
    }
  };

  useEffect(() => {
    getVideosHandler(true);
  }, [tabValue]);

  const changeTab = (e: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    dispatch(setHomePageSelectedTab(newValue));
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2} justifyContent="space-around">
          <Grid item xs={12} sm={4}>
            Total Videos Published: {totalVideosPublished}
          </Grid>
          <Grid item xs={12} sm={4}>
            Total Names Publishing: {totalNamesPublished}
          </Grid>
          <Grid item xs={12} sm={4}>
            Average Videos per Name: {videosPerNamePublished}
          </Grid>
        </Grid>
      </Box>
    <Grid container sx={{ width: "100%" }}>
      <FiltersCol item xs={12} md={2} lg={2} xl={2} sm={3}>
        <FiltersContainer>
          <Input
            id="standard-adornment-name"
            onChange={e => {
              setFilterSearch(e.target.value);
            }}
            value={filterSearch}
            placeholder="Search"
            onKeyDown={handleInputKeyDown}
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
          <Input
            id="standard-adornment-name"
            onChange={e => {
              setFilterName(e.target.value);
            }}
            value={filterName}
            placeholder="User's Name (Exact)"
            onKeyDown={handleInputKeyDown}
            sx={{
              marginTop: "20px",
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

          <FiltersSubContainer>
            <FormControl sx={{ width: "100%", marginTop: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
                  <InputLabel
                    sx={{
                      fontSize: "16px",
                    }}
                    id="Category"
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="Category"
                    input={<OutlinedInput label="Category" />}
                    value={selectedCategoryVideos?.id || ""}
                    onChange={handleOptionCategoryChangeVideos}
                    sx={{
                      // Target the input field
                      ".MuiSelect-select": {
                        fontSize: "16px", // Change font size for the selected value
                        padding: "10px 5px 15px 15px;",
                      },
                      // Target the dropdown icon
                      ".MuiSelect-icon": {
                        fontSize: "20px", // Adjust if needed
                      },
                      // Target the dropdown menu
                      "& .MuiMenu-paper": {
                        ".MuiMenuItem-root": {
                          fontSize: "14px", // Change font size for the menu items
                        },
                      },
                    }}
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
                      <InputLabel
                        sx={{
                          fontSize: "16px",
                        }}
                        id="Sub-Category"
                      >
                        Sub-Category
                      </InputLabel>
                      <Select
                        labelId="Sub-Category"
                        input={<OutlinedInput label="Sub-Category" />}
                        value={selectedSubCategoryVideos?.id || ""}
                        onChange={e =>
                          handleOptionSubCategoryChangeVideos(
                            e,
                            subCategories[selectedCategoryVideos?.id]
                          )
                        }
                        sx={{
                          // Target the input field
                          ".MuiSelect-select": {
                            fontSize: "16px", // Change font size for the selected value
                            padding: "10px 5px 15px 15px;",
                          },
                          // Target the dropdown icon
                          ".MuiSelect-icon": {
                            fontSize: "20px", // Adjust if needed
                          },
                          // Target the dropdown menu
                          "& .MuiMenu-paper": {
                            ".MuiMenuItem-root": {
                              fontSize: "14px", // Change font size for the menu items
                            },
                          },
                        }}
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
              </Box>
            </FormControl>
          </FiltersSubContainer>
          <FiltersSubContainer>
            <FiltersRow>
              Videos
              <FiltersRadioButton
                checked={filterType === "videos"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFilterType("videos");
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </FiltersRow>
            <FiltersRow>
              Playlists
              <FiltersRadioButton
                checked={filterType === "playlists"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFilterType("playlists");
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </FiltersRow>
          </FiltersSubContainer>
          <Button
            onClick={() => {
              filtersToDefault();
            }}
            sx={{
              marginTop: "20px",
            }}
            variant="contained"
          >
            reset
          </Button>
          <Button
            onClick={() => {
              getVideosHandler(true);
            }}
            sx={{
              marginTop: "20px",
            }}
            variant="contained"
          >
            Search
          </Button>
        </FiltersContainer>
      </FiltersCol>
      <Grid item xs={12} md={10} lg={7} xl={8} sm={9}>
        <ProductManagerRow>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <SubtitleContainer
              sx={{
                justifyContent: "flex-start",
                paddingLeft: "15px",
                width: "100%",
                maxWidth: "1400px",
              }}
            ></SubtitleContainer>
            <TabContext value={tabValue}>
              <TabList
                onChange={changeTab}
                textColor={"secondary"}
                indicatorColor={"secondary"}
              >
                <Tab
                  label="All Videos"
                  value={allTabValue}
                  sx={{ fontSize: tabFontSize }}
                />
                <Tab
                  label="Subscriptions"
                  value={subscriptionTabValue}
                  sx={{ fontSize: tabFontSize }}
                />
              </TabList>
              <TabPanel value={allTabValue} sx={{ width: "100%" }}>
                <VideoList videos={videos} />
                <LazyLoad
                  onLoadMore={getVideosHandler}
                  isLoading={isLoading}
                ></LazyLoad>
              </TabPanel>
              <TabPanel value={subscriptionTabValue} sx={{ width: "100%" }}>
                {persistSelector.subscriptionList.length > 0 ? (
                  <>
                    <VideoList videos={videos} />
                    <LazyLoad
                      onLoadMore={getVideosHandler}
                      isLoading={isLoading}
                    ></LazyLoad>
                  </>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    You have no subscriptions
                  </div>
                )}
              </TabPanel>
            </TabContext>
          </Box>
        </ProductManagerRow>
      </Grid>
      <FiltersCol item xs={0} lg={3} xl={2}>
        <ListSuperLikeContainer />
      </FiltersCol>
    </Grid>
    </>
  );
};
