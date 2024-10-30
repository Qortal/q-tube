import { videoRefType } from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
import {
  QTUBE_VIDEO_BASE,
  SUPER_LIKE_BASE,
} from "../../../constants/Identifiers.ts";
import {
  minPriceSuperlike,
  titleFormatterOnSave,
} from "../../../constants/Misc.ts";
import { useFetchSuperLikes } from "../../../hooks/useFetchSuperLikes.tsx";
import { setIsLoadingGlobal } from "../../../state/features/globalSlice.ts";
import { addToHashMap } from "../../../state/features/videoSlice.ts";
import { RootState } from "../../../state/store.ts";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const useVideoContentState = () => {
  const { name: channelName, id } = useParams();

  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const containerRef = useRef<videoRefType>(null);

  const [nameAddress, setNameAddress] = useState<string>("");
  const [descriptionHeight, setDescriptionHeight] = useState<null | number>(
    null
  );
  const [videoData, setVideoData] = useState<any>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const [loadingSuperLikes, setLoadingSuperLikes] = useState<boolean>(false);
  const [superLikeList, setSuperLikeList] = useState<any[]>([]);
  const { addSuperlikeRawDataGetToList } = useFetchSuperLikes();

  const contentRef = useRef(null);

  const getAddressName = async name => {
    const response = await qortalRequest({
      action: "GET_NAME_DATA",
      name: name,
    });

    if (response?.owner) {
      setNameAddress(response.owner);
    }
  };

  useEffect(() => {
    if (channelName) {
      getAddressName(channelName);
    }
  }, [channelName]);
  const avatarUrl = useMemo(() => {
    let url = "";
    if (channelName && userAvatarHash[channelName]) {
      url = userAvatarHash[channelName];
    }

    return url;
  }, [userAvatarHash, channelName]);
  const navigate = useNavigate();
  const theme = useTheme();

  const hashMapVideos = useSelector(
    (state: RootState) => state.video.hashMapVideos
  );
  const videoReference = useMemo(() => {
    if (!videoData) return null;
    const { videoReference } = videoData;
    if (
      videoReference?.identifier &&
      videoReference?.name &&
      videoReference?.service
    ) {
      setIsVideoLoaded(true);
      return videoReference;
    } else {
      return null;
    }
  }, [videoData]);

  const videoCover = useMemo(() => {
    if (!videoData) return null;
    const { videoImage } = videoData;
    return videoImage || null;
  }, [videoData]);
  const dispatch = useDispatch();

  const getVideoData = useCallback(async (name: string, id: string) => {
    try {
      if (!name || !id) return;
      dispatch(setIsLoadingGlobal(true));

      const url = `/arbitrary/resources/search?mode=ALL&service=DOCUMENT&query=${QTUBE_VIDEO_BASE}&limit=1&includemetadata=true&reverse=true&excludeblocked=true&name=${name}&exactmatchnames=true&offset=0&identifier=${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
          user: resourceData.name,
          videoImage: "",
          id: resourceData.identifier,
        };

        const responseData = await qortalRequest({
          action: "FETCH_QDN_RESOURCE",
          name: name,
          service: "DOCUMENT",
          identifier: id,
        });

        if (responseData && !responseData.error) {
          const combinedData = {
            ...resourceData,
            ...responseData,
          };

          setVideoData(combinedData);
          dispatch(addToHashMap(combinedData));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsLoadingGlobal(false));
    }
  }, []);

  useEffect(() => {
    if (channelName && id) {
      const existingVideo = hashMapVideos[id + "-" + channelName];

      if (existingVideo) {
        setVideoData(existingVideo);
      } else {
        getVideoData(channelName, id);
      }
    }
  }, [id, channelName]);

  const descriptionThreshold = 200;
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > descriptionThreshold)
        setDescriptionHeight(descriptionThreshold);
    }
  }, [videoData]);

  const getComments = useCallback(async (id, nameAddressParam) => {
    if (!id) return;
    try {
      setLoadingSuperLikes(true);

      const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&query=${SUPER_LIKE_BASE}${id.slice(
        0,
        39
      )}&limit=100&includemetadata=true&reverse=true&excludeblocked=true`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      let comments: any[] = [];
      for (const comment of responseData) {
        if (
          comment.identifier &&
          comment.name &&
          comment?.metadata?.description
        ) {
          try {
            const result = extractSigValue(comment?.metadata?.description);
            if (!result) continue;
            const res = await getPaymentInfo(result);
            if (
              +res?.amount >= minPriceSuperlike &&
              res.recipient === nameAddressParam &&
              isTimestampWithinRange(res?.timestamp, comment.created)
            ) {
              addSuperlikeRawDataGetToList({
                name: comment.name,
                identifier: comment.identifier,
                content: comment,
              });

              comments = [
                ...comments,
                {
                  ...comment,
                  message: "",
                  amount: res.amount,
                },
              ];
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      setSuperLikeList(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuperLikes(false);
    }
  }, []);

  useEffect(() => {
    if (!nameAddress || !id) return;
    getComments(id, nameAddress);
  }, [getComments, id, nameAddress]);
  const subList = useSelector(
    (state: RootState) => state.persist.subscriptionList
  );

  const focusVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("in focusVideo");
    const target = e.target as Element;

    const textTagNames = ["TEXTAREA", "P", "H[1-6]", "STRONG", "svg", "A"];
    const noText =
      textTagNames.findIndex(s => {
        return target?.tagName.match(s);
      }) < 0;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const clickOnEmptySpace = !target?.onclick && noText;

    console.log("tagName is: ", target?.tagName);
    // clicking on link in superlikes bar shows deleted video when loading

    if (target == e.currentTarget || clickOnEmptySpace) {
      console.log("in correctTarget");
      const focusRef = containerRef.current?.getContainerRef()?.current;
      focusRef.focus({ preventScroll: true });
    }
  };
  return {
    focusVideo,
    videoReference,
    channelName,
    id,
    videoCover,
    containerRef,
    isVideoLoaded,
    navigate,
    theme,
    videoData,
    descriptionHeight,
    isExpandedDescription,
    setIsExpandedDescription,
    contentRef,
    descriptionThreshold,
    loadingSuperLikes,
    superLikeList,
    setSuperLikeList,
    getComments,
    getVideoData,
    setVideoData,
  };
};

export function isTimestampWithinRange(resTimestamp, resCreated) {
  // Calculate the absolute difference in milliseconds
  const difference = Math.abs(resTimestamp - resCreated);

  // 2 minutes in milliseconds
  const twoMinutesInMilliseconds = 3 * 60 * 1000;

  // Check if the difference is within 2 minutes
  return difference <= twoMinutesInMilliseconds;
}

export function extractSigValue(metadescription) {
  // Function to extract the substring within double asterisks
  function extractSubstring(str) {
    const match = str.match(/\*\*(.*?)\*\*/);
    return match ? match[1] : null;
  }

  // Function to extract the 'sig' value
  function extractSig(str) {
    const regex = /sig:(.*?)(;|$)/;
    const match = str.match(regex);
    return match ? match[1] : null;
  }

  // Extracting the relevant substring
  const relevantSubstring = extractSubstring(metadescription);

  if (relevantSubstring) {
    // Extracting the 'sig' value
    return extractSig(relevantSubstring);
  } else {
    return null;
  }
}

export const getPaymentInfo = async (signature: string) => {
  if (signature === "undefined" || !signature) return undefined;

  try {
    const url = `/transactions/signature/${signature}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Coin payment info must be added to responseData so we can display it to the user
    const responseData = await response.json();
    if (responseData && !responseData.error) return responseData;
    else {
      throw new Error("unable to get payment");
    }
  } catch (error) {
    throw new Error("unable to get payment");
  }
};
