import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Box, Grid, Tab } from "@mui/material";
import React from "react";
import LazyLoad from "../../components/common/LazyLoad";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import { fontSizeMedium } from "../../constants/Misc.ts";
import { SearchSidebar } from "./Components/SearchSidebar.tsx";
import { FiltersCol, VideoManagerRow } from "./Components/VideoList-styles.tsx";
import VideoList from "./Components/VideoList.tsx";
import { useHomeState } from "./Home-State.ts";
import { SubtitleContainer } from "./Home-styles";

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

  return (
    <>
      <Grid container sx={{ width: "100%" }}>
        <SearchSidebar onSearch={getVideosHandler} />
        <Grid item xs={12} md={10} lg={7} xl={8} sm={9}>
          <VideoManagerRow>
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
                    value={"all"}
                    sx={{ fontSize: fontSizeMedium }}
                  />
                  <Tab
                    label="Subscriptions"
                    value={"subscriptions"}
                    sx={{ fontSize: fontSizeMedium }}
                  />
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
                  ) : !isLoading ? (
                    <div style={{ textAlign: "center" }}>
                      You have no subscriptions
                    </div>
                  ) : (
                    <></>
                  )}
                </TabPanel>
              </TabContext>
            </Box>
          </VideoManagerRow>
        </Grid>
        <FiltersCol item xs={0} lg={3} xl={2}>
          <ListSuperLikeContainer />
        </FiltersCol>
      </Grid>
    </>
  );
};
