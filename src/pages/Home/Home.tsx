import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Box, Tab, useMediaQuery } from "@mui/material";
import React from "react";
import LazyLoad from "../../components/common/LazyLoad";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import { fontSizeLarge, fontSizeSmall } from "../../constants/Misc.ts";
import { SearchSidebar } from "./Components/SearchSidebar.tsx";
import VideoList from "./Components/VideoList.tsx";
import { useHomeState } from "./Home-State.ts";

interface HomeProps {
  mode?: string;
}
export const Home = ({ mode }: HomeProps) => {
  const {
    tabValue,
    changeTab,
    videos,
    isLoading,
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

  return (
    <>
      <Box sx={{ ...homeBaseSX, ...homeColumns }}>
        <SearchSidebar onSearch={getVideosHandler} />

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
              <VideoList videos={videos} />
              <LazyLoad
                onLoadMore={getVideosHandler}
                isLoading={isLoading}
              ></LazyLoad>
            </TabPanel>
            <TabPanel value={"subscriptions"} sx={tabPaneSX}>
              {filteredSubscriptionList.length > 0 ? (
                <>
                  <VideoList videos={videos} />
                  <LazyLoad
                    onLoadMore={getVideosHandler}
                    isLoading={isLoading}
                  ></LazyLoad>
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
