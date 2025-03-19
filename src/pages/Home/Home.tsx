import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Box, Tab, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import LazyLoad from "../../components/common/LazyLoad";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
  useTestIdentifiers,
} from "../../constants/Identifiers.ts";
import { fontSizeLarge, fontSizeSmall } from "../../constants/Misc.ts";
import { RootState } from "../../state/store.ts";
import { SearchSidebar } from "./Components/SearchSidebar.tsx";
import VideoList from "./Components/VideoList.tsx";
import { useHomeState } from "./Home-State.ts";
import { useSelector } from "react-redux";

interface HomeProps {
  mode?: string;
}
export const Home = ({ mode }: HomeProps) => {
  const {
    tabValue,
    changeTab,
    videos,
    isLoading,
    filterName,
    filterSearch,
    filterValue,
    filterType,
    selectedCategoryVideos,
    selectedSubCategoryVideos,
    filteredSubscriptionList,
    getVideosHandler,
  } = useHomeState(mode);

  const tabPaneSX = {
    width: "100%",
    paddingLeft: "0px",
    paddingRight: "0px",
  };
  const isScreenSmall = !useMediaQuery("(min-width:600px)");
  const isScreenLarge = useMediaQuery("(min-width:1200px)");

  const tabSX = {
    fontSize: isScreenSmall ? fontSizeSmall : fontSizeLarge,
    paddingLeft: "0px",
    paddingRight: "0px",
  };

  const homeBaseSX = { display: "grid", width: "100%" };
  const bigGridSX = { gridTemplateColumns: "200px auto 250px" };
  const mediumGridSX = { gridTemplateColumns: "200px auto" };
  const smallGridSX = { gridTemplateColumns: "100%", gap: "20px" };

  let homeColumns: object;
  if (isScreenLarge) homeColumns = bigGridSX;
  else if (!isScreenSmall) homeColumns = mediumGridSX;
  else homeColumns = smallGridSX;

  let description: string = undefined;
  if (selectedCategoryVideos) {
    description = `category:${selectedCategoryVideos}`;

    if (selectedSubCategoryVideos)
      description += `;subcategory:${selectedSubCategoryVideos}`;
  }
  const initialSearchParams = {
    identifier:
      filterType === "playlists" ? QTUBE_PLAYLIST_BASE : QTUBE_VIDEO_BASE,
    service: filterType === "playlists" ? "PLAYLIST" : "DOCUMENT",
    offset: 0,
    reverse: true,
    limit: 20,
    excludeBlocked: true,
  };
  const [searchParametersBase, setSearchParametersBase] =
    useState<any>(initialSearchParams);

  return (
    <>
      <Box sx={{ ...homeBaseSX, ...homeColumns }}>
        <SearchSidebar
          onSearch={() =>
            setSearchParametersBase({
              ...initialSearchParams,
              identifier:
                filterType === "playlists"
                  ? QTUBE_PLAYLIST_BASE
                  : QTUBE_VIDEO_BASE,
              service: filterType === "playlists" ? "PLAYLIST" : "DOCUMENT",
              description,
              query: filterSearch,
              offset: 0,
              reverse: true,
              limit: 20,
            })
          }
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TabContext value={tabValue}>
            <TabList
              onChange={changeTab}
              textColor={"secondary"}
              indicatorColor={"secondary"}
              centered={false}
            >
              <Tab label="All" value={"all"} sx={tabSX} />
              <Tab label="Subscriptions" value={"subscriptions"} sx={tabSX} />
            </TabList>
            <TabPanel value={"all"} sx={tabPaneSX}>
              <VideoList
                listName={"AllVideos"}
                searchParameters={{
                  ...searchParametersBase,
                  name: filterName,
                }}
              />
            </TabPanel>
            <TabPanel value={"subscriptions"} sx={tabPaneSX}>
              {filteredSubscriptionList.length > 0 ? (
                <>
                  <VideoList
                    listName={"SubscribedVideos"}
                    searchParameters={{
                      ...searchParametersBase,
                      names:
                        filterName ||
                        filteredSubscriptionList.map(s => s.subscriberName),
                    }}
                  />
                </>
              ) : (
                !isLoading && (
                  <div style={{ textAlign: "center" }}>
                    You have no subscriptions
                  </div>
                )
              )}
            </TabPanel>
          </TabContext>
        </Box>
        <ListSuperLikeContainer />
      </Box>
    </>
  );
};
