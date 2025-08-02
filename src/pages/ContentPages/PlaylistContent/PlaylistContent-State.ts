import { useVideoContentState } from '../VideoContent/VideoContent-State.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'qapp-core';

export const usePlaylistContentState = () => {
  const {
    channelName,
    id,
    videoData,
    superLikeList,
    videoReference,
    videoCover,
    theme,
    descriptionHeight,
    setSuperLikeList,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
    setVideoMetadataResource,
  } = useVideoContentState();

  const { name } = useAuth();
  const userName = name;
  const [doAutoPlay, setDoAutoPlay] = useState(false);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const calculateAmountSuperlike = useMemo(() => {
    const totalQort = superLikeList?.reduce((acc, curr) => {
      if (curr?.amount && !isNaN(parseFloat(curr.amount)))
        return acc + parseFloat(curr.amount);
      else return acc;
    }, 0);
    return totalQort?.toFixed(2);
  }, [superLikeList]);
  const numberOfSuperlikes = useMemo(() => {
    return superLikeList?.length ?? 0;
  }, [superLikeList]);

  const navigate = useNavigate();
  const [playlistData, setPlaylistData] = useState<any>(null);

  const checkforPlaylist = useCallback(async (name, id) => {
    try {
      setIsLoadingPlaylist(true);

      if (!name || !id) return;

      const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&identifier=${id}&limit=1&includemetadata=true&reverse=true&excludeblocked=true&name=${name}&exactmatchnames=true&offset=0`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseDataSearch = await response.json();

      if (responseDataSearch?.length > 0) {
        let resourceData = responseDataSearch[0];
        resourceData = {
          title: resourceData?.metadata?.title,
          category: resourceData?.metadata?.category,
          categoryName: resourceData?.metadata?.categoryName,
          tags: resourceData?.metadata?.tags || [],
          description: resourceData?.metadata?.description,
          created: resourceData?.created,
          updated: resourceData?.updated,
          name: resourceData.name,
          videoImage: '',
          identifier: resourceData.identifier,
          service: resourceData.service,
        };

        const responseData = await qortalRequest({
          action: 'FETCH_QDN_RESOURCE',
          name: resourceData.name,
          service: resourceData.service,
          identifier: resourceData.identifier,
        });

        if (responseData && !responseData.error) {
          const combinedData = {
            ...resourceData,
            ...responseData,
          };
          const videos = [];
          if (combinedData?.videos) {
            for (const vid of combinedData.videos) {
              const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&identifier=${vid.identifier}&limit=1&includemetadata=true&reverse=true&name=${vid.name}&exactmatchnames=true&offset=0`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const responseDataSearchVid = await response.json();

              if (responseDataSearchVid?.length > 0) {
                const resourceData2 = responseDataSearchVid[0];
                videos.push(resourceData2);
              }
            }
          }
          combinedData.videos = videos;
          setPlaylistData(combinedData);
          if (combinedData?.videos?.length > 0) {
            const vid = combinedData?.videos[0];
            setVideoMetadataResource({
              name: vid?.name,
              identifier: vid?.identifier,
              service: 'DOCUMENT',
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPlaylist(false);
    }
  }, []);

  useEffect(() => {
    if (channelName && id) {
      checkforPlaylist(channelName, id);
    }
  }, [id, channelName]);

  const nextVideo = useMemo(() => {
    const currentVideoIndex = playlistData?.videos?.findIndex(
      (item) => item?.identifier === videoData?.id
    );
    if (currentVideoIndex !== -1) {
      const nextVideoIndex = currentVideoIndex + 1;
      const findVideo = playlistData?.videos[nextVideoIndex] || null;
      if (findVideo) {
        const id = findVideo?.identifier?.replace('_metadata', '');
        return {
          ...findVideo,
          service: 'VIDEO',
          identifier: id,
          jsonId: findVideo?.identifier,
        };
      }
    }

    return null;
  }, [playlistData, videoData]);

  const onEndVideo = useCallback(() => {
    const currentVideoIndex = playlistData?.videos?.findIndex(
      (item) => item?.identifier === videoData?.id
    );
    if (currentVideoIndex !== -1) {
      const nextVideoIndex = currentVideoIndex + 1;
      const findVideo = playlistData?.videos[nextVideoIndex] || null;
      if (findVideo) {
        setVideoMetadataResource({
          name: findVideo?.name,
          identifier: findVideo?.identifier,
          service: 'DOCUMENT',
        });
        setDoAutoPlay(true);
      }
    }
  }, [videoData, playlistData]);

  return {
    channelName,
    id,
    videoData,
    superLikeList,
    setVideoMetadataResource,
    videoReference,
    videoCover,
    theme,
    descriptionHeight,
    nextVideo,
    onEndVideo,
    doAutoPlay,
    playlistData,
    navigate,
    userName,
    numberOfSuperlikes,
    calculateAmountSuperlike,
    setSuperLikeList,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
    isLoadingPlaylist,
  };
};
