import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setIsLoadingGlobal } from "../../state/features/globalSlice";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { VideoPlayer } from "../../components/common/VideoPlayer";
import { RootState } from "../../state/store";
import { addToHashMap } from "../../state/features/videoSlice";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";

import mockImg from "../../test/mockimg.jpg";
import {
  AuthorTextComment,
  FileAttachmentContainer,
  FileAttachmentFont,
  Spacer,
  StyledCardColComment,
  StyledCardHeaderComment,
  VideoDescription,
  VideoPlayerContainer,
  VideoTitle,
} from "./PlaylistContent-styles";
import { setUserAvatarHash } from "../../state/features/globalSlice";
import {
  formatDate,
  formatDateSeconds,
  formatTimestampSeconds,
} from "../../utils/time";
import { NavbarName } from "../../components/layout/Navbar/Navbar-styles";
import { CommentSection } from "../../components/common/Comments/CommentSection";
import {
  CrowdfundSubTitle,
  CrowdfundSubTitleRow,
} from "../../components/PublishVideo/PublishVideo-styles.tsx";
import { Playlists } from "../../components/Playlists/Playlists";
import { DisplayHtml } from "../../components/common/TextEditor/DisplayHtml";
import FileElement from "../../components/common/FileElement";
import { SuperLike } from "../../components/common/SuperLike/SuperLike";
import { useFetchSuperLikes } from "../../hooks/useFetchSuperLikes";
import {
  extractSigValue,
  getPaymentInfo,
  isTimestampWithinRange,
} from "../VideoContent/VideoContent";
import { SuperLikesSection } from "../../components/common/SuperLikesList/SuperLikesSection";
import {
  QTUBE_VIDEO_BASE,
  SUPER_LIKE_BASE,
} from "../../constants/Identifiers.ts";
import { minPriceSuperlike } from "../../constants/Misc.ts";
import { SubscribeButton } from "../../components/common/SubscribeButton.tsx";

export const PlaylistContent = () => {
  const { name, id } = useParams();
  const [doAutoPlay, setDoAutoPlay] = useState(false);
  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const [descriptionHeight, setDescriptionHeight] = useState<null | number>(
    null
  );
  const [superlikeList, setSuperlikelist] = useState<any[]>([]);
  const [loadingSuperLikes, setLoadingSuperLikes] = useState<boolean>(false);
  const { addSuperlikeRawDataGetToList } = useFetchSuperLikes();

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
    if (name) {
      getAddressName(name);
    }
  }, [name]);

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const contentRef = useRef(null);

  const avatarUrl = useMemo(() => {
    let url = "";
    if (name && userAvatarHash[name]) {
      url = userAvatarHash[name];
    }

    return url;
  }, [userAvatarHash, name]);
  const navigate = useNavigate();
  const theme = useTheme();

  const [videoData, setVideoData] = useState<any>(null);
  const [playlistData, setPlaylistData] = useState<any>(null);

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
          checkforPlaylist(name, id);
        }
      }
    } catch (error) {
    } finally {
      dispatch(setIsLoadingGlobal(false));
    }
  }, []);

  const checkforPlaylist = React.useCallback(
    async (name, id) => {
      try {
        dispatch(setIsLoadingGlobal(true));

        if (!name || !id) return;

        const url = `/arbitrary/resources/search?mode=ALL&service=PLAYLIST&identifier=${id}&limit=1&includemetadata=true&reverse=true&excludeblocked=true&name=${name}&exactmatchnames=true&offset=0`;
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
            name: resourceData.name,
            videoImage: "",
            identifier: resourceData.identifier,
            service: resourceData.service,
          };

          const responseData = await qortalRequest({
            action: "FETCH_QDN_RESOURCE",
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
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                const responseDataSearchVid = await response.json();

                if (responseDataSearchVid?.length > 0) {
                  let resourceData2 = responseDataSearchVid[0];
                  videos.push(resourceData2);
                }
              }
            }
            combinedData.videos = videos;
            setPlaylistData(combinedData);
            if (combinedData?.videos?.length > 0) {
              const vid = combinedData?.videos[0];
              const fullId = vid ? `${vid.identifier}-${vid.name}` : undefined;
              const existingVideo = hashMapVideos[fullId];

              if (existingVideo) {
                setVideoData(existingVideo);
              } else {
                getVideoData(vid?.name, vid?.identifier);
              }
            }
          }
        }
      } catch (error) {
      } finally {
        dispatch(setIsLoadingGlobal(false));
      }
    },
    [hashMapVideos]
  );

  React.useEffect(() => {
    if (name && id) {
      checkforPlaylist(name, id);
    }
  }, [id, name]);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > 100) {
        // Assuming 100px is your threshold
        setDescriptionHeight(100);
      }
    }
  }, [videoData]);

  const nextVideo = useMemo(() => {
    const currentVideoIndex = playlistData?.videos?.findIndex(
      item => item?.identifier === videoData?.id
    );
    if (currentVideoIndex !== -1) {
      const nextVideoIndex = currentVideoIndex + 1;
      const findVideo = playlistData?.videos[nextVideoIndex] || null;
      if (findVideo) {
        const id = findVideo?.identifier?.replace("_metadata", "");
        return {
          ...findVideo,
          service: "VIDEO",
          identifier: id,
          jsonId: findVideo?.identifier,
        };
      }
    }

    return null;
  }, [playlistData, videoData]);

  const onEndVideo = useCallback(() => {
    const currentVideoIndex = playlistData?.videos?.findIndex(
      item => item?.identifier === videoData?.id
    );
    if (currentVideoIndex !== -1) {
      const nextVideoIndex = currentVideoIndex + 1;
      const findVideo = playlistData?.videos[nextVideoIndex] || null;
      if (findVideo) {
        getVideoData(findVideo?.name, findVideo?.identifier);
        setDoAutoPlay(true);
      }
    }
  }, [videoData, playlistData]);

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
          } catch (error) {}
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
    if (!nameAddress || !videoData?.id) return;
    getComments(videoData?.id, nameAddress);
  }, [getComments, videoData?.id, nameAddress]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px 10px",
      }}
    >
      <VideoPlayerContainer
        sx={{
          marginBottom: "30px",
        }}
      >
        {videoData && videoData?.videos?.length === 0 ? (
          <>
            <Box
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <Typography>This playlist is empty</Typography>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "70vw 30vw",
                width: "100vw",
              }}
            >
              {videoReference && (
                <VideoPlayer
                  name={videoReference?.name}
                  service={videoReference?.service}
                  identifier={videoReference?.identifier}
                  user={name}
                  jsonId={id}
                  poster={videoCover || ""}
                  nextVideo={nextVideo}
                  onEnd={onEndVideo}
                  autoPlay={doAutoPlay}
                />
              )}
              {playlistData && (
                <Playlists
                  playlistData={playlistData}
                  currentVideoIdentifier={videoData?.id}
                  onClick={getVideoData}
                />
              )}
            </Box>
            <Spacer height="15px" />
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {" "}
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
                      navigate(`/channel/${name}`);
                    }}
                  >
                    <Avatar
                      src={`/arbitrary/THUMBNAIL/${name}/qortal_avatar`}
                      alt={`${name}'s avatar`}
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
                        navigate(`/channel/${name}`);
                      }}
                    >
                      {name}
                      <SubscribeButton
                        name={name}
                        sx={{ marginLeft: "20px" }}
                      />
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
                )}
                <FileAttachmentContainer>
                  <FileAttachmentFont>Save to Disk</FileAttachmentFont>
                  <FileElement
                    fileInfo={{
                      ...videoReference,
                      filename:
                        videoData?.filename ||
                        videoData?.title?.slice(0, 20) + ".mp4",
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
                  textAlign: "center",
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
            <Box
              sx={{
                background: "#333333",
                borderRadius: "5px",
                padding: "5px",
                width: "100%",
                cursor: !descriptionHeight
                  ? "default"
                  : isExpandedDescription
                  ? "default"
                  : "pointer",
                position: "relative",
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
                    : "100px",
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
              {descriptionHeight && (
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
          </>
        )}
      </VideoPlayerContainer>
      <SuperLikesSection
        getMore={() => {}}
        loadingSuperLikes={loadingSuperLikes}
        superlikes={superlikeList}
        postId={videoData?.id || ""}
        postName={videoData?.user || ""}
      />
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <CommentSection postId={videoData?.id || ""} postName={name || ""} />
      </Box>
    </Box>
  );
};
