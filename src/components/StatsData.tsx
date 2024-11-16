import React, { useEffect } from "react";
import { styled } from "@mui/system";
import { Grid } from "@mui/material";
import { useFetchVideos } from "../hooks/useFetchVideos.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";
import { signal } from "@preact/signals-react";

/* eslint-disable react-refresh/only-export-components */
export const totalVideosPublished = signal(0);
export const totalNamesPublished = signal(0);
export const videosPerNamePublished = signal(0);

export const StatsData = () => {
  const StatsCol = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "20px 0px",
    backgroundColor: theme.palette.background.default,
  }));

  const { getVideosCount } = useFetchVideos();

  const showValueIfExists = (value: number) => {
    return value > 0 ? "inline" : "none";
  };

  const showStats = useSelector((state: RootState) => state.persist.showStats);
  const showVideoCount = showValueIfExists(totalVideosPublished.value);
  const showPublisherCount = showValueIfExists(totalNamesPublished.value);
  const showAverage = showValueIfExists(videosPerNamePublished.value);
  useEffect(() => {
    getVideosCount();
  }, [getVideosCount]);

  return (
    <StatsCol sx={{ display: showStats ? "block" : "none" }}>
      <div>
        Videos:{" "}
        <span style={{ fontWeight: "bold", display: showVideoCount }}>
          {totalVideosPublished.value}
        </span>
      </div>
      <div>
        Publishers:{" "}
        <span style={{ fontWeight: "bold", display: showPublisherCount }}>
          {totalNamesPublished.value}
        </span>
      </div>
      <div>
        Average:{" "}
        <span
          style={{
            fontWeight: "bold",
            display: showAverage,
          }}
        >
          {Number(videosPerNamePublished.value).toFixed(0)}
        </span>
      </div>
    </StatsCol>
  );
};
