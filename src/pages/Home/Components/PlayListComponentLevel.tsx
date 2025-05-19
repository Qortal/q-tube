import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LazyLoad from "../../../components/common/LazyLoad.tsx";
import { useFetchVideos } from "../../../hooks/useFetchVideos.tsx";
import { Video } from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
import { queue } from "../../../wrappers/GlobalWrapper.tsx";
import { VideoManagerRow } from "./VideoList-styles.tsx";
import { useSignal } from "@preact/signals-react";
import { PlayListList } from "./PlayListList.tsx";

interface VideoListProps {
  mode?: string;
}

export const PlayListComponentLevel = ({ mode }: VideoListProps) => {
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

  // 16-May-2025: Includes Pagination for PlayLists
  const getVideos = React.useCallback(async () => {
    isLoading.value = true;
    try {

      // Query to get a users playlists
      //'http://192.168.0.43:12391/arbitrary/resources/search?service=PLAYLIST&name=Ice&exactmatchnames=true&limit=20&reverse=true' \

      const offset = pageRef.current * PAGE_SIZE;
      const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&name=${encodeURIComponent(paramName)}&exactmatchnames=true&limit=20&reverse=true&offset=${offset}`; 
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

     /*  This is the search result for playlists by a specific use
      [
        {
          "name": "Ice",
          "service": "PLAYLIST",
          "identifier": "qtube_playlist_the-history-of-qortal_wZ9BtX",
          "size": 11824,
          "created": 1747327830726
        }
      ]
      */

     /*  This is the result when getting the JSON infomration about a PLAYLIST
      { "title": "The History of Qortal", 
      "version": 1, 
      "description": "A timeline of Qortal according to Ice", 
      "htmlDescription": "<p>A timeline of Qortal according to Ice</p>", 
      "image": "data:image/webp;base64,UklGRugqAABXRUJQVlA4WAoAAAAgAAAASwIAFQAGSJuX2Ws5....YY9umRdt3kC5BWqZoIno3+DIAAA", 
      "videos": [
      { "identifier": "qtube_vid_q-tube-may-15_32Mf4d_metadata", "name": "Ice", "service": "DOCUMENT", "code": "GLzeC**<p>New In Qortal? 15-May 2025</p><p>Come see new enhancements specific to Q-Tube</p><p><br></p>" }, 
      { "identifier": "qtube_vid_11-why-crowetic-dedicated-to-q_nmHmNo_metadata", "name": "QortalNuggets", "service": "DOCUMENT", "code": "Q3fbb**<p>Ernest asks WHY. Jason answers.</p>" }, 
      { "identifier": "qtube_vid_qortal-conscious-soul-festival_55y2u0_metadata", "name": "ThanksToZen", "service": "DOCUMENT", "code": "Xvwjg**Footage from day 1 of 2" }, 
      { "identifier": "qtube_vid_qortal-at-web3-amsterdamvideo7_1lCJT4_metadata", "name": "igorcoin", "service": "DOCUMENT", "code": "IbRmX**qortal-at-web3-amsterdam_video_720p_eesti keelsete subtiitritega" }
      ], 
      "commentsId": "qtube_playlist__cm_wZ9BtX", "category": 26, "subcategory": "" }
      */

      const structureData = responseData.map((video: any): Video => {
        return {
          title: video?.metadata?.title,
          category: video?.metadata?.category,
          categoryName: video?.metadata?.categoryName,
          tags: video?.metadata?.tags || [],
          description: video?.metadata?.description,
          created: video?.created,
          updated: video?.updated,
          service: `PLAYLIST`,
          user: video.name,
          videoImage: "",
          id: video.identifier,
        };
      });

      // Pre-Pagination
      //setVideos((prev) => {
      //  const copiedVideos: Video[] = [...prev];
      //  structureData.forEach((video: Video) => {
      //    const index = prev.findIndex((p) => p.id === video.id);
      //    if (index !== -1) {
      //      copiedVideos[index] = video;
      //    } else {
      //      copiedVideos.push(video);
      //    }
      //  });
      //  return copiedVideos;
      //});

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
        <PlayListList videos={videos} />
        <LazyLoad
          onLoadMore={hasMore ? getVideos : undefined}
          isLoading={isLoading.value}
        />
      </Box>
    </VideoManagerRow>
  );
};
