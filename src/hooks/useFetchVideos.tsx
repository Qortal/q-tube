import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addVideos,
  addToHashMap,
  setCountNewVideos,
  upsertVideos,
  upsertVideosBeginning,
  Video,
  upsertFilteredVideos,
} from "../state/features/videoSlice";
import {
  setIsLoadingGlobal,
  setUserAvatarHash,
} from "../state/features/globalSlice";
import { RootState } from "../state/store";
import { fetchAndEvaluateVideos } from "../utils/fetchVideos";
import { RequestQueue } from "../utils/queue";
import { queue } from "../wrappers/GlobalWrapper";
import {
  QTUBE_PLAYLIST_BASE,
  QTUBE_VIDEO_BASE,
} from "../constants/Identifiers.ts";
import { allTabValue, subscriptionTabValue } from "../constants/Misc.ts";

export const useFetchVideos = () => {
  const dispatch = useDispatch();
  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );
  const videos = useSelector((state: RootState) => state.video.videos);
  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const filteredVideos = useSelector(
    (state: RootState) => state.video.filteredVideos
  );

  const subscriptions = useSelector(
    (state: RootState) => state.video.subscriptionList
  );

  const checkAndUpdateVideo = React.useCallback(
    (video: Video) => {
      const existingVideo = hashMapVideos[video.id + "-" + video.user];
      if (!existingVideo) {
        return true;
      } else if (
        video?.updated &&
        existingVideo?.updated &&
        (!existingVideo?.updated || video?.updated) > existingVideo?.updated
      ) {
        return true;
      } else {
        return false;
      }
    },
    [hashMapVideos]
  );

  const getAvatar = React.useCallback(async (author: string) => {
    try {
      let url = await qortalRequest({
        action: "GET_QDN_RESOURCE_URL",
        name: author,
        service: "THUMBNAIL",
        identifier: "qortal_avatar",
      });

      dispatch(
        setUserAvatarHash({
          name: author,
          url,
        })
      );
    } catch (error) {}
  }, []);

  const getVideo = async (
    user: string,
    videoId: string,
    content: any,
    retries: number = 0
  ) => {
    try {
      const res = await fetchAndEvaluateVideos({
        user,
        videoId,
        content,
      });

      dispatch(addToHashMap(res));
    } catch (error) {
      retries = retries + 1;
      if (retries < 2) {
        // 3 is the maximum number of retries here, you can adjust it to your needs
        queue.push(() => getVideo(user, videoId, content, retries + 1));
      } else {
        console.error("Failed to get video after 3 attempts", error);
      }
    }
  };

  const getNewVideos = React.useCallback(async () => {
    try {
      dispatch(setIsLoadingGlobal(true));

      // const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}&limit=20&includemetadata=false&reverse=true&exc
      // ludeblocked=true&exactmatchnames=true`;
      //
      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const responseData = await response.json();

      const responseData = await qortalRequest({
        action: "SEARCH_QDN_RESOURCES",
        mode: "ALL",
        service: "DOCUMENT",
        query: "${QTUBE_VIDEO_BASE}",
        limit: 20,
        includeMetadata: true,
        reverse: true,
        excludeBlocked: true,
        exactMatchNames: true,
      });

      const latestVideo = videos[0];
      if (!latestVideo) return;
      const findVideo = responseData?.findIndex(
        (item: any) => item?.identifier === latestVideo?.id
      );
      let fetchAll = responseData;
      let willFetchAll = true;
      if (findVideo !== -1) {
        willFetchAll = false;
        fetchAll = responseData.slice(0, findVideo);
      }

      const structureData = fetchAll.map((video: any): Video => {
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
      if (!willFetchAll) {
        dispatch(upsertVideosBeginning(structureData));
      }
      if (willFetchAll) {
        dispatch(addVideos(structureData));
      }
      setTimeout(() => {
        dispatch(setCountNewVideos(0));
      }, 1000);
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
      dispatch(setIsLoadingGlobal(false));
    }
  }, [videos, hashMapVideos]);

  const getVideos = React.useCallback(
    async (
      filters = {},
      reset?: boolean,
      resetFilters?: boolean,
      limit?: number,
      listType = allTabValue
    ) => {
      try {
        const {
          name = "",
          category = "",
          subcategory = "",
          keywords = "",
          type = "",
        }: any = resetFilters ? {} : filters;
        let offset = videos.length;
        if (reset) {
          offset = 0;
        }
        const videoLimit = limit || 20;

        let defaultUrl = `/arbitrary/resources/search?mode=ALL&includemetadata=false&reverse=true&excludeblocked=true&exactmatchnames=true&offset=${offset}&limit=${videoLimit}`;

        if (name) {
          defaultUrl = defaultUrl + `&name=${name}`;
        }
        if (listType === subscriptionTabValue) {
          subscriptions.map(sub => {
            defaultUrl += `&name=${sub}`;
          });
        }

        if (category) {
          if (!subcategory) {
            defaultUrl = defaultUrl + `&description=category:${category}`;
          } else {
            defaultUrl =
              defaultUrl +
              `&description=category:${category};subcategory:${subcategory}`;
          }
        }
        if (keywords) {
          defaultUrl = defaultUrl + `&query=${keywords}`;
        }
        if (type === "playlists") {
          defaultUrl = defaultUrl + `&service=PLAYLIST`;
          defaultUrl = defaultUrl + `&identifier=${QTUBE_PLAYLIST_BASE}`;
        } else {
          defaultUrl = defaultUrl + `&service=DOCUMENT`;
          defaultUrl = defaultUrl + `&identifier=${QTUBE_VIDEO_BASE}`;
        }

        // const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}&limit=${videoLimit}&includemetadata=false&reverse=true&excludeblocked=true&exactmatchnames=true&offset=${offset}`
        const url = defaultUrl;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        // const responseData = await qortalRequest({
        //   action: "SEARCH_QDN_RESOURCES",
        //   mode: "ALL",
        //   service: "DOCUMENT",
        //   query: "${QTUBE_VIDEO_BASE}",
        //   limit: 20,
        //   includeMetadata: true,
        //   offset: offset,
        //   reverse: true,
        //   excludeBlocked: true,
        //   exactMatchNames: true,
        //   name: names
        // })
        const structureData = responseData.map((video: any): Video => {
          return {
            title: video?.metadata?.title,
            service: video?.service,
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
        if (reset) {
          dispatch(addVideos(structureData));
        } else {
          dispatch(upsertVideos(structureData));
        }
        for (const content of structureData) {
          if (content.user && content.id) {
            const res = checkAndUpdateVideo(content);
            if (res) {
              queue.push(() => getVideo(content.user, content.id, content));
            }
          }
        }
      } catch (error) {
        console.log({ error });
      } finally {
      }
    },
    [videos, hashMapVideos]
  );

  const getVideosFiltered = React.useCallback(
    async (filterValue: string) => {
      try {
        const offset = filteredVideos.length;
        const replaceSpacesWithUnderscore = filterValue.replace(/ /g, "_");

        const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${replaceSpacesWithUnderscore}&identifier=${QTUBE_VIDEO_BASE}&limit=10&includemetadata=false&reverse=true&excludeblocked=true&exactmatchnames=true&offset=${offset}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        // const responseData = await qortalRequest({
        //   action: "SEARCH_QDN_RESOURCES",
        //   mode: "ALL",
        //   service: "DOCUMENT",
        //   query: replaceSpacesWithUnderscore,
        //   identifier: "${QTUBE_VIDEO_BASE}",
        //   limit: 20,
        //   includeMetadata: true,
        //   offset: offset,
        //   reverse: true,
        //   excludeBlocked: true,
        //   exactMatchNames: true,
        //   name: names
        // })
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
        dispatch(upsertFilteredVideos(structureData));

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
    },
    [filteredVideos, hashMapVideos]
  );

  const checkNewVideos = React.useCallback(async () => {
    try {
      const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}&limit=20&includemetadata=false&reverse=true&excludeblocked=true&exactmatchnames=true`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      // const responseData = await qortalRequest({
      //   action: "SEARCH_QDN_RESOURCES",
      //   mode: "ALL",
      //   service: "DOCUMENT",
      //   query: "${QTUBE_VIDEO_BASE}",
      //   limit: 20,
      //   includeMetadata: true,
      //   reverse: true,
      //   excludeBlocked: true,
      //   exactMatchNames: true,
      //   name: names
      // })
      const latestVideo = videos[0];
      if (!latestVideo) return;
      const findVideo = responseData?.findIndex(
        (item: any) => item?.identifier === latestVideo?.id
      );
      if (findVideo === -1) {
        dispatch(setCountNewVideos(responseData.length));
        return;
      }
      const newArray = responseData.slice(0, findVideo);
      dispatch(setCountNewVideos(newArray.length));
      return;
    } catch (error) {}
  }, [videos]);

  return {
    getVideos,
    checkAndUpdateVideo,
    getVideo,
    hashMapVideos,
    getNewVideos,
    checkNewVideos,
    getVideosFiltered,
  };
};
