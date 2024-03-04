import React, { useEffect } from "react";
import { styled } from "@mui/system";
import { Grid } from "@mui/material";
import { useFetchVideos } from "../hooks/useFetchVideos.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";

export const StatsData = () => {
  const StatsCol = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "20px 0px",
    backgroundColor: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.background.paper}`,
    borderRight: `1px solid ${theme.palette.background.paper}`,
  }));

  const {
    getVideos,
    getNewVideos,
    checkNewVideos,
    getVideosFiltered,
    getVideosCount,
  } = useFetchVideos();

  const persistReducer = useSelector((state: RootState) => state.persist);
  const totalVideosPublished = useSelector(
    (state: RootState) => state.global.totalVideosPublished
  );
  const totalNamesPublished = useSelector(
    (state: RootState) => state.global.totalNamesPublished
  );
  const videosPerNamePublished = useSelector(
    (state: RootState) => state.global.videosPerNamePublished
  );

  useEffect(() => {
    getVideosCount();
  }, [getVideosCount]);

  return (
    <StatsCol sx={{ display: persistReducer.showStats ? "block" : "none" }}>
      <div>
        Videos:{" "}
        <span style={{ fontWeight: "bold" }}>{totalVideosPublished}</span>
      </div>
      <div>
        Publishers:{" "}
        <span style={{ fontWeight: "bold" }}>{totalNamesPublished}</span>
      </div>
      <div>
        Average:{" "}
        <span style={{ fontWeight: "bold" }}>{videosPerNamePublished}</span>
      </div>
    </StatsCol>
  );
};
