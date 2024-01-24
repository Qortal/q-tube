import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import {
  Avatar,
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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useFetchVideos } from "../../hooks/useFetchVideos";
import LazyLoad from "../../components/common/LazyLoad";
import {
  BlockIconContainer,
  BottomParent,
  FilterSelect,
  FiltersCheckbox,
  FiltersCol,
  FiltersContainer,
  FiltersRow,
  FiltersSubContainer,
  FiltersTitle,
  IconsBox,
  NameContainer,
  VideoCardCol,
  ProductManagerRow,
  VideoCardContainer,
  VideoCard,
  VideoCardName,
  VideoCardTitle,
  VideoContainer,
  VideoUploadDate,
} from "./VideoList-styles";
import ResponsiveImage from "../../components/ResponsiveImage";
import { formatDate, formatTimestampSeconds } from "../../utils/time";
import { Subtitle, SubtitleContainer } from "./Home-styles";
import { ExpandMoreSVG } from "../../assets/svgs/ExpandMoreSVG";
import {
  addVideos,
  blockUser,
  changeFilterType,
  changeSelectedCategoryVideos,
  changeSelectedSubCategoryVideos,
  changefilterName,
  changefilterSearch,
  clearVideoList,
  setEditPlaylist,
  setEditVideo,
} from "../../state/features/videoSlice";
import { categories, subCategories } from "../../constants/Categories.ts";
import { Playlists } from "../../components/Playlists/Playlists";
import { PlaylistSVG } from "../../assets/svgs/PlaylistSVG";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import { VideoCardImageContainer } from "./VideoCardImageContainer";
import { SubscribeButton } from "../../components/common/SubscribeButton.tsx";

interface VideoListProps {
  mode?: string;
}
export const VideoList = ({ mode }: VideoListProps) => {
  const theme = useTheme();
  const prevVal = useRef("");
  const isFiltering = useSelector(
    (state: RootState) => state.video.isFiltering
  );
  const filterValue = useSelector(
    (state: RootState) => state.video.filterValue
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState(null);

  const filterType = useSelector((state: RootState) => state.video.filterType);

  const setFilterType = payload => {
    dispatch(changeFilterType(payload));
  };
  const filterSearch = useSelector(
    (state: RootState) => state.video.filterSearch
  );

  const setFilterSearch = payload => {
    dispatch(changefilterSearch(payload));
  };
  const filterName = useSelector((state: RootState) => state.video.filterName);

  const setFilterName = payload => {
    dispatch(changefilterName(payload));
  };

  const selectedCategoryVideos = useSelector(
    (state: RootState) => state.video.selectedCategoryVideos
  );

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
  const username = useSelector((state: RootState) => state.auth?.user?.name);
  const isFilterMode = useRef(false);
  const firstFetch = useRef(false);
  const afterFetch = useRef(false);
  const isFetchingFiltered = useRef(false);
  const isFetching = useRef(false);
  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );

  const countNewVideos = useSelector(
    (state: RootState) => state.video.countNewVideos
  );
  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );

  const { videos: globalVideos } = useSelector(
    (state: RootState) => state.video
  );
  const navigate = useNavigate();
  const { getVideos, getNewVideos, checkNewVideos, getVideosFiltered } =
    useFetchVideos();

  const getVideosHandler = React.useCallback(
    async (reset?: boolean, resetFilers?: boolean) => {
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
        reset ? true : false,
        resetFilers
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
    ]
  );

  useEffect(() => {
    if (isFiltering && filterValue !== prevVal?.current) {
      prevVal.current = filterValue;
      getVideosHandler();
    }
  }, [filterValue, isFiltering, filteredVideos]);

  const getVideosHandlerMount = React.useCallback(async () => {
    if (firstFetch.current) return;
    firstFetch.current = true;
    setIsLoading(true);

    await getVideos();
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

  const blockUserFunc = async (user: string) => {
    if (user === "Q-Tube") return;

    try {
      const response = await qortalRequest({
        action: "ADD_LIST_ITEMS",
        list_name: "blockedNames",
        items: [user],
      });

      if (response === true) {
        dispatch(blockUser(user));
      }
    } catch (error) {}
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter") {
      getVideosHandler(true);
    }
  };

  return (
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
          <FiltersTitle>
            Categories
            <ExpandMoreSVG
              color={theme.palette.text.primary}
              height={"22"}
              width={"22"}
            />
          </FiltersTitle>
          <FiltersSubContainer>
            <FormControl sx={{ width: "100%" }}>
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
          <FiltersTitle>
            Type
            <ExpandMoreSVG
              color={theme.palette.text.primary}
              height={"22"}
              width={"22"}
            />
          </FiltersTitle>
          <FiltersSubContainer>
            <FiltersRow>
              Videos
              <FiltersCheckbox
                checked={filterType === "videos"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFilterType("videos");
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </FiltersRow>
            <FiltersRow>
              Playlists
              <FiltersCheckbox
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

            <VideoCardContainer>
              {videos.map((video: any, index: number) => {
                const fullId = video ? `${video.id}-${video.user}` : undefined;
                const existingVideo = hashMapVideos[fullId];
                let hasHash = false;
                let videoObj = video;
                if (existingVideo) {
                  videoObj = existingVideo;
                  hasHash = true;
                }

                let avatarUrl = "";
                if (userAvatarHash[videoObj?.user]) {
                  avatarUrl = userAvatarHash[videoObj?.user];
                }

                if (hasHash && !videoObj?.videoImage && !videoObj?.image) {
                  return null;
                }
                const isPlaylist = videoObj?.service === "PLAYLIST";

                if (isPlaylist) {
                  return (
                    <VideoCardCol
                      onMouseEnter={() => setShowIcons(videoObj.id)}
                      onMouseLeave={() => setShowIcons(null)}
                      key={videoObj.id}
                    >
                      <IconsBox
                        sx={{
                          opacity: showIcons === videoObj.id ? 1 : 0,
                          zIndex: 2,
                        }}
                      >
                        {videoObj?.user === username && (
                          <Tooltip title="Edit playlist" placement="top">
                            <BlockIconContainer>
                              <EditIcon
                                onClick={() => {
                                  dispatch(setEditPlaylist(videoObj));
                                }}
                              />
                            </BlockIconContainer>
                          </Tooltip>
                        )}

                        <Tooltip title="Block user content" placement="top">
                          <BlockIconContainer>
                            <BlockIcon
                              onClick={() => {
                                blockUserFunc(videoObj?.user);
                              }}
                            />
                          </BlockIconContainer>
                        </Tooltip>
                      </IconsBox>
                      <VideoCard
                        sx={{
                          cursor: !hasHash && "default",
                        }}
                        onClick={() => {
                          if (!hasHash) return;
                          navigate(
                            `/playlist/${videoObj?.user}/${videoObj?.id}`
                          );
                        }}
                      >
                        <ResponsiveImage
                          src={videoObj?.image}
                          width={266}
                          height={150}
                          style={{
                            maxHeight: "50%",
                          }}
                        />
                        <VideoCardTitle>{videoObj?.title}</VideoCardTitle>
                        <BottomParent>
                          <NameContainer
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/channel/${videoObj?.user}`);
                            }}
                          >
                            <Avatar
                              sx={{ height: 24, width: 24 }}
                              src={`/arbitrary/THUMBNAIL/${videoObj?.user}/qortal_avatar`}
                              alt={`${videoObj?.user}'s avatar`}
                            />
                            <VideoCardName
                              sx={{
                                ":hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {videoObj?.user}
                            </VideoCardName>

                            {videoObj?.created && (
                              <VideoUploadDate>
                                {formatDate(videoObj.created)}
                              </VideoUploadDate>
                            )}
                          </NameContainer>
                          <Box
                            sx={{
                              display: "flex",
                              position: "absolute",
                              bottom: "5px",
                              right: "5px",
                            }}
                          >
                            <PlaylistSVG
                              color={theme.palette.text.primary}
                              height="36px"
                              width="36px"
                            />
                          </Box>
                        </BottomParent>
                      </VideoCard>
                    </VideoCardCol>
                  );
                }

                return (
                  <VideoCardCol
                    key={videoObj.id}
                    onMouseEnter={() => setShowIcons(videoObj.id)}
                    onMouseLeave={() => setShowIcons(null)}
                  >
                    <IconsBox
                      sx={{
                        opacity: showIcons === videoObj.id ? 1 : 0,
                        zIndex: 2,
                      }}
                    >
                      {videoObj?.user === username && (
                        <Tooltip title="Edit video properties" placement="top">
                          <BlockIconContainer>
                            <EditIcon
                              onClick={() => {
                                dispatch(setEditVideo(videoObj));
                              }}
                            />
                          </BlockIconContainer>
                        </Tooltip>
                      )}

                      <Tooltip title="Block user content" placement="top">
                        <BlockIconContainer>
                          <BlockIcon
                            onClick={() => {
                              blockUserFunc(videoObj?.user);
                            }}
                          />
                        </BlockIconContainer>
                      </Tooltip>
                    </IconsBox>
                    <VideoCard
                      onClick={() => {
                        navigate(`/video/${videoObj?.user}/${videoObj?.id}`);
                      }}
                    >
                      <VideoCardImageContainer
                        width={266}
                        height={150}
                        videoImage={videoObj.videoImage}
                        frameImages={videoObj?.extracts || []}
                      />
                      {/* <ResponsiveImage
                      src={videoObj.videoImage}
                      width={266}
                      height={150}
                    /> */}
                      <VideoCardTitle>{videoObj.title}</VideoCardTitle>
                      <BottomParent>
                        <NameContainer
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/channel/${videoObj?.user}`);
                          }}
                        >
                          <Avatar
                            sx={{ height: 24, width: 24 }}
                            src={`/arbitrary/THUMBNAIL/${videoObj?.user}/qortal_avatar`}
                            alt={`${videoObj?.user}'s avatar`}
                          />
                          <VideoCardName
                            sx={{
                              ":hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {videoObj?.user}
                          </VideoCardName>
                          <SubscribeButton name={videoObj?.user} />
                        </NameContainer>
                        {videoObj?.created && (
                          <VideoUploadDate>
                            {formatDate(videoObj.created)}
                          </VideoUploadDate>
                        )}
                      </BottomParent>
                    </VideoCard>
                  </VideoCardCol>
                );
              })}
            </VideoCardContainer>

            <LazyLoad
              onLoadMore={getVideosHandler}
              isLoading={isLoading}
            ></LazyLoad>
          </Box>
        </ProductManagerRow>
      </Grid>
      <FiltersCol item xs={0} lg={3} xl={2}>
        <ListSuperLikeContainer />
      </FiltersCol>
    </Grid>
  );
};
