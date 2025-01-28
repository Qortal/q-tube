import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LazyLoad from "../../../components/common/LazyLoad.tsx";
import { QTUBE_VIDEO_BASE } from "../../../constants/Identifiers.ts";
import { useFetchVideos } from "../../../hooks/useFetchVideos.tsx";
import { Video } from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
import { queue } from "../../../wrappers/GlobalWrapper.tsx";
import { VideoManagerRow } from "./VideoList-styles.tsx";
import VideoList from "./VideoList.tsx";
import { useSignal } from "@preact/signals-react";

interface VideoListProps {
  mode?: string;
}

export const VideoListComponentLevel = ({ mode }: VideoListProps) => {
  const { name: paramName } = useParams();

  const firstFetch = useRef(false);
  const afterFetch = useRef(false);
  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );

  const [videos, setVideos] = React.useState<Video[]>([]);
  const isLoading = useSignal(true);
  const { getVideo, checkAndUpdateVideo } = useFetchVideos();

  const getVideos = React.useCallback(async () => {
    isLoading.value = true;
    try {
      const offset = videos.length;
      const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}&limit=20&includemetadata=false&reverse=true&excludeblocked=true&name=${paramName}&exactmatchnames=true&offset=${offset}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      const structureData = responseData.map((video: any): Video => {
        return {
          title: video?.metadata?.title,
          category: video?.metadata?.category,
          categoryName: video?.metadata?.categoryName,
          tags: video?.metadata?.tags || [],
          description: video?.metadata?.description,
          created: video?.created,
          updated: video?.updated,
          user: video.name,
          videoImage: "",
          id: video.identifier,
        };
      });

      const copiedVideos: Video[] = [...videos];
      structureData.forEach((video: Video) => {
        const index = videos.findIndex(p => p.id === video.id);
        if (index !== -1) {
          copiedVideos[index] = video;
        } else {
          copiedVideos.push(video);
        }
      });
      setVideos(copiedVideos);

      for (const content of structureData) {
        if (content.user && content.id) {
          const res = checkAndUpdateVideo(content);
          if (res) {
            queue.push(() => getVideo(content.user, content.id, content));
          }
        }
      }
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  }, [videos, hashMapVideos]);

  const getVideosHandlerMount = React.useCallback(async () => {
    if (firstFetch.current) return;
    firstFetch.current = true;
    await getVideos();
    afterFetch.current = true;
  }, [getVideos]);

  useEffect(() => {
    if (!firstFetch.current) {
      getVideosHandlerMount();
    }
  }, [getVideosHandlerMount]);

  return (
    <VideoManagerRow>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <VideoList videos={videos} />
        <LazyLoad onLoadMore={getVideos} isLoading={isLoading.value}></LazyLoad>
      </Box>
    </VideoManagerRow>
  );
};
