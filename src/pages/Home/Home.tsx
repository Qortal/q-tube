import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Box, Grid, Tab } from "@mui/material";
import React from "react";
import LazyLoad from "../../components/common/LazyLoad";
import { ListSuperLikeContainer } from "../../components/common/ListSuperLikes/ListSuperLikeContainer.tsx";
import { SearchSidebar } from "./Components/SearchSidebar.tsx";
import {
  FiltersCol,
  ProductManagerRow,
} from "./Components/VideoList-styles.tsx";
import VideoList from "./Components/VideoList.tsx";
import { useHomeState } from "./Home-State.tsx";
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

  const tabFontSize = "100%";
  return (
    <>
      <Grid container sx={{ width: "100%" }}>
        <SearchSidebar onSearch={getVideosHandler} />
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
                    value={"all"}
                    sx={{ fontSize: tabFontSize }}
                  />
                  <Tab
                    label="Subscriptions"
                    value={"subscriptions"}
                    sx={{ fontSize: tabFontSize }}
                  />
                </TabList>
                <TabPanel value={"all"} sx={{ width: "100%" }}>
                  <VideoList videos={videos} />
                  <LazyLoad
                    onLoadMore={getVideosHandler}
                    isLoading={isLoading}
                  ></LazyLoad>
                </TabPanel>
                <TabPanel value={"subscriptions"} sx={{ width: "100%" }}>
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
          </ProductManagerRow>
        </Grid>
        <FiltersCol item xs={0} lg={3} xl={2}>
          <ListSuperLikeContainer />
        </FiltersCol>
      </Grid>
    </>
  );
};
