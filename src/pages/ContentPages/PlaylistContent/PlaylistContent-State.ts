import { useAuth } from 'qapp-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidVideoReference } from '../../../utils/checkStructure.ts';
import { useVideoContentState } from '../VideoContent/VideoContent-State.ts';

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
  const abortControllerRef = useRef<AbortController | null>(null);
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

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&identifier=${id}&limit=1&includemetadata=true&reverse=true&excludeblocked=true&name=${name}&exactmatchnames=true&offset=0`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
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
          const videos: any[] = [];
          if (combinedData?.videos) {
            for (const vid of combinedData.videos) {
              // Check if request was aborted
              if (abortController.signal.aborted) {
                return;
              }

              const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&identifier=${vid.identifier}&limit=1&includemetadata=true&reverse=true&name=${vid.name}&exactmatchnames=true&offset=0`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                signal: abortController.signal,
              });
              const responseDataSearchVid = await response.json();

              if (responseDataSearchVid?.length > 0) {
                const resourceData2 = responseDataSearchVid[0];

                // Validate the member's video reference (name +
                // identifier + service) directly from the playlist
                // data. No extra QDN fetch needed — an empty/garbage
                // reference means the playlist entry is broken.
                const isValid = isValidVideoReference(vid);
                const isOwn = resourceData2?.name === userName;

                // Drop invalid members that aren't owned by the user.
                // Keep owned invalid members so the owner can edit/delete.
                if (!isValid && !isOwn) continue;

                // Check if playlistTitle exists in the playlist data
                const playlistVideo = combinedData.videos.find(
                  (v) => v.identifier === vid.identifier
                );

                // If playlistTitle exists, use it, otherwise use metadata title
                if (playlistVideo?.playlistTitle) {
                  resourceData2.metadata = {
                    ...resourceData2.metadata,
                    title: playlistVideo.playlistTitle,
                  };
                }

                // Tag the member so the UI can render the invalid
                // state (red strikethrough + tooltip) when owned.
                resourceData2.isInvalid = !isValid;

                videos.push(resourceData2);
              }
            }
          }
          combinedData.videos = videos;
          console.log('playlistData: ', combinedData);
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
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error(error);
      }
    } finally {
      setIsLoadingPlaylist(false);
    }
  }, []);

  useEffect(() => {
    if (channelName && id) {
      checkforPlaylist(channelName, id);
    }

    // Cleanup function to abort pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id, channelName, checkforPlaylist]);

  const nextVideo = useMemo(() => {
    const currentVideoIndex = playlistData?.videos?.findIndex(
      (item) => item?.identifier === videoData?.identifier
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
      (item) => item?.identifier === videoData?.identifier
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
