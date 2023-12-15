import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
} from "./VideoContent-styles";
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
} from "../../components/UploadVideo/Upload-styles";
import { FOR_SUPER_LIKE, QTUBE_VIDEO_BASE, SUPER_LIKE_BASE, minPriceSuperlike } from "../../constants";
import { Playlists } from "../../components/Playlists/Playlists";
import { DisplayHtml } from "../../components/common/TextEditor/DisplayHtml";
import FileElement from "../../components/common/FileElement";
import { SuperLike } from "../../components/common/SuperLike/SuperLike";
import { CommentContainer } from "../../components/common/Comments/Comments-styles";
import { Comment } from "../../components/common/Comments/Comment";
import { SuperLikesSection } from "../../components/common/SuperLikesList/SuperLikesSection";
import { useFetchSuperLikes } from "../../hooks/useFetchSuperLikes";

export function isTimestampWithinRange(resTimestamp, resCreated) {
  // Calculate the absolute difference in milliseconds
  var difference = Math.abs(resTimestamp - resCreated);

  // 2 minutes in milliseconds
  var twoMinutesInMilliseconds = 2 * 60 * 1000;

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
    if (responseData && !responseData.error) {
     return responseData;
    } else {
      throw new Error('unable to get payment')
    }
  } catch (error) {
    throw new Error('unable to get payment')
  }
};


export const VideoContent = () => {
  const { name, id } = useParams();
  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const [superlikeList, setSuperlikelist] = useState<any[]>([])
  const [loadingSuperLikes, setLoadingSuperLikes] = useState<boolean>(false)
  const {addSuperlikeRawDataGetToList}  = useFetchSuperLikes()

  const calculateAmountSuperlike = useMemo(()=> {
    const totalQort = superlikeList?.reduce((acc, curr)=> {
      if(curr?.amount && !isNaN(parseFloat(curr.amount))) return acc + parseFloat(curr.amount)
      else return acc
    }, 0)
    return totalQort?.toFixed(2)
  }, [superlikeList])
  const numberOfSuperlikes = useMemo(()=> {
 
    return superlikeList?.length ?? 0
  }, [superlikeList])
  
  const [nameAddress, setNameAddress] = useState<string>('')
    const [descriptionHeight, setDescriptionHeight] =
    useState<null | number>(null);
    
  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const contentRef = useRef(null);
  
  const getAddressName = async (name)=> {
    const response = await qortalRequest({
      action: "GET_NAME_DATA",
      name: name
    });

    if(response?.owner){
      setNameAddress(response.owner)
    }
  }

  useEffect(()=> {
    if(name){
      

        getAddressName(name)
    }
  }, [name])
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
        }
      }
    } catch (error) {
    } finally {
      dispatch(setIsLoadingGlobal(false));
    }
  }, []);

 
  React.useEffect(() => {
    if (name && id) {
      const existingVideo = hashMapVideos[id];

      if (existingVideo) {
        setVideoData(existingVideo);
      } else {
        getVideoData(name, id);
      }
    }
  }, [id, name]);

  

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > 100) { // Assuming 100px is your threshold
        setDescriptionHeight(100)
      }
    }
  }, [videoData]); 

  
  const getComments = useCallback(
    async (id, nameAddressParam) => {
      if(!id) return
      try {
        setLoadingSuperLikes(true);
      
     
        const url = `/arbitrary/resources/search?mode=ALL&service=BLOG_COMMENT&query=${SUPER_LIKE_BASE}${id.slice(
          0,39
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
          if (comment.identifier && comment.name && comment?.metadata?.description) {
            
    
              try {
               
                const result = extractSigValue(comment?.metadata?.description)
            if(!result) continue
               const res = await getPaymentInfo(result);
               if(+res?.amount >= minPriceSuperlike && res.recipient === nameAddressParam && isTimestampWithinRange(res?.timestamp, comment.created)){
                addSuperlikeRawDataGetToList({name:comment.name, identifier:comment.identifier, content: comment})

                 comments = [...comments, {
                   ...comment,
                   message: "",
                   amount: res.amount
                 }];
 
               }
 
              } catch (error) {
               
              }
 
             

       
        
          }
        }
    
        setSuperlikelist(comments);
      
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSuperLikes(false);
      }
    },
    []
  );

  useEffect(() => {
    if(!nameAddress || !id) return
    getComments(id, nameAddress);
  }, [getComments, id, nameAddress]);


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
        {videoReference && (
          <VideoPlayer
            name={videoReference?.name}
            service={videoReference?.service}
            identifier={videoReference?.identifier}
            user={name}
            jsonId={id}
            poster={videoCover || ""}
          />
        )}

        <Spacer height="15px" />
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
        <FileAttachmentContainer>
                   
                    <FileAttachmentFont>
                      save to disk
                    </FileAttachmentFont>
                    <FileElement
                      fileInfo={{...videoReference,
                        filename: videoData?.filename || videoData?.title?.slice(0,20) + '.mp4',
                        mimeType: videoData?.videoType || '"video/mp4',
                      
                      }}
                      title={videoData?.filename || videoData?.title?.slice(0,20)}
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
                  
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: '20px',
            gap: '10px'
          }}>
             <VideoTitle
          variant="h1"
          color="textPrimary"
          sx={{
            textAlign: "start",
          }}
        >
          {videoData?.title}
        </VideoTitle>
        {videoData && (
              <SuperLike numberOfSuperlikes={numberOfSuperlikes} totalAmount={calculateAmountSuperlike} name={videoData?.user} service={videoData?.service} identifier={videoData?.id} onSuccess={(val)=> {
                setSuperlikelist((prev)=> [val, ...prev])
              }} />
        )}
      
          </Box>
       
        {videoData?.created && (
          <Typography
            variant="h6"
            sx={{
              fontSize: "12px",
            }}
            color={theme.palette.text.primary}
          >
            {formatDate(videoData.created)}
          </Typography>
        )}

        <Spacer height="15px" />
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(`/channel/${name}`);
          }}
        >
          <StyledCardHeaderComment
            sx={{
              "& .MuiCardHeader-content": {
                overflow: "hidden",
              },
            }}
          >
            <Box>
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
              >
                {name}
              </AuthorTextComment>
            </StyledCardColComment>
          </StyledCardHeaderComment>
        </Box>
        <Spacer height="15px" />
        <Box
          sx={{
            background: "#333333",
            borderRadius: "5px",
            padding: "5px",
            width: "100%",
            cursor: !descriptionHeight ? "default" : isExpandedDescription ? "default" : "pointer",
            position: "relative",
          }}
          className={!descriptionHeight ? "": isExpandedDescription ? "" : "hover-click"}
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
              height: !descriptionHeight ? 'auto' : isExpandedDescription ? "auto" : "100px",
              overflow: "hidden",
            }}
          >
            {videoData?.htmlDescription ? (
              <DisplayHtml html={videoData?.htmlDescription} />
            ) : (
              <VideoDescription variant="body1" color="textPrimary" sx={{
                cursor: 'default'
              }}>
                {videoData?.fullDescription}
              </VideoDescription>
            )}
          </Box>
          {descriptionHeight && (
             <Typography
             onClick={() => {
               setIsExpandedDescription((prev) => !prev);
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
      </VideoPlayerContainer>
      <SuperLikesSection getMore={()=> {

      }} loadingSuperLikes={loadingSuperLikes} superlikes={superlikeList} postId={id || ""} postName={name || ""} />
     
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <CommentSection postId={id || ""} postName={name || ""} />
      </Box>
    </Box>
  );
};
