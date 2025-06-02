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
  // For Pagination
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    firstFetch.current = false;
    setVideos([]);
    pageRef.current = 0;
    setHasMore(true);
  }, [paramName]);

  const getVideos = React.useCallback(async () => {
    isLoading.value = true;
    try {
      const offset = pageRef.current * PAGE_SIZE;
      console.log('getVideos ParamName:', paramName); 
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

      setVideos(prev => {
        const updatedVideos = [...prev];

        structureData.forEach(video => {
          const exists = updatedVideos.some(v => v.id === video.id);
          if (!exists) {
            updatedVideos.push(video);
          }
        });
        return updatedVideos;
      });

      // If fewer than PAGE_SIZE results, we've reached the end
      if (structureData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }

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
  }, [checkAndUpdateVideo, getVideo, hashMapVideos, paramName]);

  useEffect(() => {
    const fetchVideos = async () => {
      firstFetch.current = true;
      console.log("Running useEffect: " + paramName); 
      await getVideos();
      afterFetch.current = true;
    };

    if (!firstFetch.current) {
      fetchVideos();
    }
  }, [paramName, getVideos]);

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
        <LazyLoad
          onLoadMore={hasMore ? getVideos : undefined}
          isLoading={isLoading.value}
        />
      </Box>
    </VideoManagerRow>
  );
};
