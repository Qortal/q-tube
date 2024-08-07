import DownloadIcon from "@mui/icons-material/Download";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DeletedVideo from "../../../assets/img/DeletedVideo.jpg";
import { CommentSection } from "../../../components/common/Comments/CommentSection.tsx";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";
import { LikeAndDislike } from "../../../components/common/ContentButtons/LikeAndDislike.tsx";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { SuperLike } from "../../../components/common/ContentButtons/SuperLike.tsx";
import FileElement from "../../../components/common/FileElement.tsx";
import { SuperLikesSection } from "../../../components/common/SuperLikesList/SuperLikesSection.tsx";
import { DisplayHtml } from "../../../components/common/TextEditor/DisplayHtml.tsx";
import {
  refType,
  VideoPlayer,
} from "../../../components/common/VideoPlayer/VideoPlayer.tsx";
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
import { formatDate } from "../../../utils/time.ts";
import {
  extractSigValue,
  getPaymentInfo,
  isTimestampWithinRange,
} from "./VideoContent-functions.ts";
import {
  AuthorTextComment,
  FileAttachmentContainer,
  FileAttachmentFont,
  Spacer,
  StyledCardColComment,
  StyledCardHeaderComment,
  VideoDescription,
  VideoContentContainer,
  VideoTitle,
  VideoPlayerContainer,
} from "./VideoContent-styles.tsx";

export const VideoContent = () => {
  const { name: channelName, id } = useParams();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const [superlikeList, setSuperlikelist] = useState<any[]>([]);
  const [loadingSuperLikes, setLoadingSuperLikes] = useState<boolean>(false);

  const { addSuperlikeRawDataGetToList } = useFetchSuperLikes();
  const containerRef = useRef<refType>(null);

  const calculateAmountSuperlike = useMemo(() => {
    const totalQort = superlikeList?.reduce((acc, curr) => {
      if (curr?.amount && !isNaN(parseFloat(curr.amount)))
        return acc + parseFloat(curr.amount);
      else return acc;
    }, 0);
    return totalQort?.toFixed(2);
  }, [superlikeList]);
  const numberOfSuperlikes = useMemo(() => {
    return superlikeList?.length ?? 0;
  }, [superlikeList]);

  const [nameAddress, setNameAddress] = useState<string>("");
  const [descriptionHeight, setDescriptionHeight] = useState<null | number>(
    null
  );
  const [videoData, setVideoData] = useState<any>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );

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

  const saveAsFilename = useMemo(() => {
    // nb. we prefer to construct the local filename to use for
    // saving, from the video "title" when possible
    if (videoData?.title) {
      // figure out filename extension
      let ext = ".mp4";
      if (videoData?.filename) {
        // nb. this regex copied from https://stackoverflow.com/a/680982
        const re = /(?:\.([^.]+))?$/;
        const match = re.exec(videoData.filename);
        if (match[1]) {
          ext = "." + match[1];
        }
      }

      return (videoData.title + ext).replace(titleFormatterOnSave, "");
    }

    // otherwise use QDN filename if applicable
    if (videoData?.filename) {
      return videoData.filename.replace(titleFormatterOnSave, "");
    }

    // TODO: this was the previous value, leaving here as the
    // fallback for now even though it probably is not needed..?
    return videoData?.filename || videoData?.title?.slice(0, 20) + ".mp4";
  }, [videoData]);

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

  const getVideoData = React.useCallback(async (name: string, id: string) => {
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

  React.useEffect(() => {
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

      setSuperlikelist(comments);
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          marginLeft: "5%",
          flexDirection: "column",
          padding: "0px 10px",
        }}
        onClick={focusVideo}
      >
        {videoReference ? (
          <VideoPlayerContainer>
            <VideoPlayer
              name={videoReference?.name}
              service={videoReference?.service}
              identifier={videoReference?.identifier}
              user={channelName}
              jsonId={id}
              poster={videoCover || ""}
              ref={containerRef}
              videoStyles={{
                videoContainer: { aspectRatio: "16 / 9" },
                video: { aspectRatio: "16 / 9" },
              }}
            />
          </VideoPlayerContainer>
        ) : isVideoLoaded ? (
          <img
            src={DeletedVideo}
            width={"70%"}
            height={"37%"}
            style={{ marginLeft: "5%" }}
          />
        ) : (
          <Box sx={{ width: "55vw", aspectRatio: "16/9" }}></Box>
        )}
        <VideoContentContainer>
          <Box
            sx={{
              width: "80%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              marginTop: "15px",
            }}
          >
            <Box>
              <StyledCardHeaderComment
                sx={{
                  "& .MuiCardHeader-content": {
                    overflow: "hidden",
                  },
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/channel/${channelName}`);
                  }}
                >
                  <Avatar
                    src={`/arbitrary/THUMBNAIL/${channelName}/qortal_avatar`}
                    alt={`${channelName}'s avatar`}
                  />
                </Box>
                <StyledCardColComment>
                  <AuthorTextComment
                    color={
                      theme.palette.mode === "light"
                        ? theme.palette.text.secondary
                        : "#d6e8ff"
                    }
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/channel/${channelName}`);
                    }}
                  >
                    {channelName}
                    {channelName !== userName && (
                      <>
                        <SubscribeButton
                          subscriberName={channelName}
                          sx={{ marginLeft: "20px" }}
                        />
                        <FollowButton
                          followerName={channelName}
                          sx={{ marginLeft: "20px" }}
                        />
                      </>
                    )}
                  </AuthorTextComment>
                </StyledCardColComment>
              </StyledCardHeaderComment>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {videoData && (
                <>
                  <LikeAndDislike
                    name={videoData?.user}
                    identifier={videoData?.id}
                  />
                  <SuperLike
                    numberOfSuperlikes={numberOfSuperlikes}
                    totalAmount={calculateAmountSuperlike}
                    name={videoData?.user}
                    service={videoData?.service}
                    identifier={videoData?.id}
                    onSuccess={val => {
                      setSuperlikelist(prev => [val, ...prev]);
                    }}
                  />
                </>
              )}
              {videoData?.filename && (
                <FileAttachmentContainer>
                  <FileAttachmentFont>Save to Disk</FileAttachmentFont>
                  <FileElement
                    fileInfo={{
                      ...videoReference,
                      filename: saveAsFilename,
                      mimeType: videoData?.videoType || '"video/mp4',
                    }}
                    title={
                      videoData?.filename || videoData?.title?.slice(0, 20)
                    }
                    customStyles={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <DownloadIcon />
                  </FileElement>
                </FileAttachmentContainer>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            <VideoTitle
              variant="h1"
              color="textPrimary"
              sx={{
                textAlign: "start",
              }}
            >
              {videoData?.title}
            </VideoTitle>
          </Box>

          {videoData?.created && (
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
              }}
              color={theme.palette.text.primary}
            >
              {formatDate(videoData.created)}
            </Typography>
          )}

          <Spacer height="30px" />
          {videoData?.fullDescription && (
            <Box
              sx={{
                background: "#333333",
                borderRadius: "5px",
                padding: "5px",
                width: "70%",
                cursor: !descriptionHeight
                  ? "default"
                  : isExpandedDescription
                  ? "default"
                  : "pointer",
                position: "relative",

                marginBottom: "30px",
              }}
              className={
                !descriptionHeight
                  ? ""
                  : isExpandedDescription
                  ? ""
                  : "hover-click"
              }
            >
              {descriptionHeight && !isExpandedDescription && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    left: "0px",
                    bottom: "0px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (isExpandedDescription) return;
                    setIsExpandedDescription(true);
                  }}
                />
              )}
              <Box
                ref={contentRef}
                sx={{
                  height: !descriptionHeight
                    ? "auto"
                    : isExpandedDescription
                    ? "auto"
                    : "200px",
                  overflow: "hidden",
                }}
              >
                {videoData?.htmlDescription ? (
                  <DisplayHtml html={videoData?.htmlDescription} />
                ) : (
                  <VideoDescription
                    variant="body1"
                    color="textPrimary"
                    sx={{
                      cursor: "default",
                    }}
                  >
                    {videoData?.fullDescription}
                  </VideoDescription>
                )}
              </Box>
              {descriptionHeight >= descriptionThreshold && (
                <Typography
                  onClick={() => {
                    setIsExpandedDescription(prev => !prev);
                  }}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    paddingLeft: "15px",
                    paddingTop: "15px",
                  }}
                >
                  {isExpandedDescription ? "Show less" : "...more"}
                </Typography>
              )}
            </Box>
          )}

          {id && channelName && (
            <>
              <SuperLikesSection
                /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                getMore={() => {}}
                loadingSuperLikes={loadingSuperLikes}
                superlikes={superlikeList}
                postId={id || ""}
                postName={channelName || ""}
              />
              <CommentSection postId={id || ""} postName={channelName || ""} />
            </>
          )}
        </VideoContentContainer>
      </Box>
    </>
  );
};
