import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { useFetchVideos } from "../../hooks/useFetchVideos";
import LazyLoad from "../../components/common/LazyLoad";
import {
  BottomParent,
  NameContainer,
  ProductManagerRow,
  VideoCard,
  VideoCardCol,
  VideoCardContainer,
  VideoCardName,
  VideoCardTitle,
  VideoContainer,
  VideoUploadDate,
} from "./VideoList-styles";
import ResponsiveImage from "../../components/ResponsiveImage";
import { formatDate, formatTimestampSeconds } from "../../utils/time";
import { Video } from "../../state/features/videoSlice";
import { queue } from "../../wrappers/GlobalWrapper";
import { QTUBE_VIDEO_BASE } from "../../constants";
import { VideoCardImageContainer } from "./VideoCardImageContainer";

interface VideoListProps {
  mode?: string;
}
export const VideoListComponentLevel = ({ mode }: VideoListProps) => {
  const { name: paramName } = useParams();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const firstFetch = useRef(false);
  const afterFetch = useRef(false);
  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );

  const countNewVideos = useSelector(
    (state: RootState) => state.video.countNewVideos
  );
  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );

  const [videos, setVideos] = React.useState<Video[]>([]);

  const navigate = useNavigate();
  const { getVideo, getNewVideos, checkNewVideos, checkAndUpdateVideo } =
    useFetchVideos();

  const getVideos = React.useCallback(async () => {
    try {
      const offset = videos.length;
      const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}_&limit=20&includemetadata=false&reverse=true&excludeblocked=true&name=${paramName}&exactmatchnames=true&offset=${offset}`;
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
        const index = videos.findIndex((p) => p.id === video.id);
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
    } catch (error) {
    } finally {
    }
  }, [videos, hashMapVideos]);

  const getVideosHandler = React.useCallback(async () => {
    if (!firstFetch.current || !afterFetch.current) return;
    await getVideos();
  }, [getVideos]);

  const getVideosHandlerMount = React.useCallback(async () => {
    if (firstFetch.current) return;
    firstFetch.current = true;
    await getVideos();
    afterFetch.current = true;
    setIsLoading(false);
  }, [getVideos]);

  useEffect(() => {
    if (!firstFetch.current) {
      getVideosHandlerMount();
    }
  }, [getVideosHandlerMount]);

  return (
    <ProductManagerRow>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <VideoCardContainer>
          {videos.map((video: any, index: number) => {
            const existingVideo = hashMapVideos[video.id];
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

            if (
              hasHash &&
              (!videoObj?.videoImage || videoObj?.videoImage?.length < 50)
            ) {
              return null;
            }

            return (
              <VideoCardCol key={videoObj.id}>
                <VideoCard
                  onClick={() => {
                    navigate(`/video/${videoObj.user}/${videoObj.id}`);
                  }}
                >
                  <VideoCardImageContainer
                    width={266}
                    height={150}
                    videoImage={videoObj.videoImage}
                    frameImages={videoObj?.extracts || []}
                  />
                  <VideoCardTitle>{videoObj.title}</VideoCardTitle>
                  <BottomParent>
                    <NameContainer>
                      <Avatar
                        sx={{ height: 24, width: 24 }}
                        src={`/arbitrary/THUMBNAIL/${videoObj?.user}/qortal_avatar`}
                        alt={`${videoObj.user}'s avatar`}
                      />
                      <VideoCardName>{videoObj.user}</VideoCardName>
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
  );
};
