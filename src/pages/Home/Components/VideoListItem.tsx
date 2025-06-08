import { Avatar, Box, Tooltip, Typography, useTheme } from "@mui/material";
import { BlockIconContainer, BottomParent, IconsBox, NameContainer, VideoCard, VideoCardCol, VideoCardName, VideoCardTitle, VideoUploadDate } from "./VideoList-styles";
import { setEditPlaylist } from "../../../state/features/videoSlice";
import ResponsiveImage from "../../../components/ResponsiveImage";
import { PlaylistSVG } from "../../../assets/svgs/PlaylistSVG";
import { formatTime } from "../../../utils/numberFunctions";
import { VideoCardImageContainer } from "./VideoCardImageContainer";
import { fontSizeSmall, minDuration } from "../../../constants/Misc";
import { formatDate } from "../../../utils/time";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { useGlobal } from "qapp-core";

export const VideoListItem = ({qortalMetadata, video, setShowIcons, showIcons, username, blockUserFunc, setEditVideo}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const theme = useTheme()
    const { lists } = useGlobal();

    const {  deleteResource } = lists;

    const isPlaylist = qortalMetadata?.service === "PLAYLIST";

    if (isPlaylist) {
        return (
          <VideoCardCol
          key={qortalMetadata?.identifier} 
          onMouseEnter={() => setShowIcons(qortalMetadata?.identifier)}
          onMouseLeave={() => setShowIcons(null)}
        >
          <IconsBox
            sx={{
              opacity: showIcons === qortalMetadata?.identifier ? 1 : 0,
              zIndex: 2,
            }}
          >
            {qortalMetadata?.name === username && (
              <Tooltip title="Edit playlist" placement="top">
                <BlockIconContainer>
                  <EditIcon
                    onClick={() => {
                      const resourceData = {
                        title: qortalMetadata?.metadata?.title,
                        category: qortalMetadata?.metadata?.category,
                        categoryName: qortalMetadata?.metadata?.categoryName,
                        tags: qortalMetadata?.metadata?.tags || [],
                        description: qortalMetadata?.metadata?.description,
                        created: qortalMetadata?.created,
                        updated: qortalMetadata?.updated,
                        name: qortalMetadata.name,
                        videoImage: "",
                        identifier: qortalMetadata.identifier,
                        service: qortalMetadata.service,
                      };
                      dispatch(setEditPlaylist({...resourceData, ...video}));
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}

            {qortalMetadata?.name !== username && (
              <Tooltip title="Block user content" placement="top">
                <BlockIconContainer>
                  <BlockIcon
                    onClick={() => {
                      blockUserFunc(qortalMetadata?.name);
                    }}
                  />
                </BlockIconContainer>
              </Tooltip>
            )}
          </IconsBox>
           
          <VideoCard
           
            onClick={() => {
              navigate(`/playlist/${qortalMetadata?.name}/${qortalMetadata?.identifier}`);
            }}
          >
            <ResponsiveImage
              src={video?.image}
              width={266}
              height={150}
              style={{
                maxHeight: "50%",
              }}
            />
            <VideoCardTitle>{video?.title}</VideoCardTitle>
            <BottomParent>
              <NameContainer
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/channel/${qortalMetadata?.name}`);
                }}
              >
                <Avatar
                  sx={{ height: 24, width: 24 }}
                  src={`/arbitrary/THUMBNAIL/${qortalMetadata?.name}/qortal_avatar`}
                  alt={`${qortalMetadata?.name}'s avatar`}
                />
                <VideoCardName
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {qortalMetadata?.name}
                </VideoCardName>

                {qortalMetadata?.created && (
                  <VideoUploadDate>
                    {formatDate(qortalMetadata.created)}
                  </VideoUploadDate>
                )}
              </NameContainer>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                }}
              >
                <PlaylistSVG
                  color={theme.palette.text.primary}
                  height="36px"
                  width="36px"
                />
              </Box>
            </BottomParent>
          </VideoCard>
          </VideoCardCol>
      );
    }

    console.log('showIcons', qortalMetadata, showIcons, qortalMetadata?.name === username, qortalMetadata?.name, username)
  return (
    <VideoCardCol
      key={qortalMetadata?.identifier}
      onMouseEnter={() => setShowIcons(qortalMetadata?.identifier)}
      onMouseLeave={() => setShowIcons(null)}
    >
      <IconsBox
        sx={{
          opacity: showIcons === qortalMetadata.identifier ? 1 : 0,
          zIndex: 2,
        }}
      >
        {qortalMetadata?.name === username && (
          <Tooltip title="Edit video properties" placement="top">
            <BlockIconContainer>
              <EditIcon
                onClick={() => {
                  const resourceData = {
                    title: qortalMetadata?.metadata?.title,
                    category: qortalMetadata?.metadata?.category,
                    categoryName: qortalMetadata?.metadata?.categoryName,
                    tags: qortalMetadata?.metadata?.tags || [],
                    description: qortalMetadata?.metadata?.description,
                    created: qortalMetadata?.created,
                    updated: qortalMetadata?.updated,
                    user: qortalMetadata.name,
                    videoImage: "",
                    id: qortalMetadata.identifier,
                  };

                  dispatch(setEditVideo({...resourceData, ...video}));
                }}
              />
            </BlockIconContainer>
          </Tooltip>
        )}

        {qortalMetadata?.name !== username && (
          <Tooltip title="Block user content" placement="top">
            <BlockIconContainer>
              <BlockIcon
                onClick={() => {
                  blockUserFunc(qortalMetadata?.name);
                }}
              />
            </BlockIconContainer>
          </Tooltip>
        )}
        {qortalMetadata?.name === username && (
          <Tooltip title="Delete video" placement="top">
            <BlockIconContainer>
              <DeleteIcon
                onClick={() => {
                  deleteResource([
                    qortalMetadata,
                    video.videoReference,
                  ]);
                }}
              />
            </BlockIconContainer>
          </Tooltip>
        )}
      </IconsBox>
      <VideoCard
        onClick={() => {
          navigate(
            `/video/${qortalMetadata?.name}/${qortalMetadata?.identifier}`
          );
        }}
      >
        {video?.duration > minDuration && (
          <Box
            position="absolute"
            right={0}
            bottom={0}
            bgcolor="#202020"
            zIndex={999}
          >
            <Typography color="white">
              {formatTime(video.duration)}
            </Typography>
          </Box>
        )}
        <VideoCardImageContainer
          width={266}
          height={150}
          videoImage={video.videoImage}
          frameImages={video?.extracts || []}
        />
        <Tooltip
          title={video.title}
          placement="top"
          slotProps={{ tooltip: { sx: { fontSize: fontSizeSmall } } }}
        >
          <VideoCardTitle>{video.title}</VideoCardTitle>
        </Tooltip>
        <BottomParent>
          <NameContainer
            onClick={e => {
              e.stopPropagation();
              navigate(`/channel/${qortalMetadata?.name}`);
            }}
          >
            <Avatar
              sx={{ height: 24, width: 24 }}
              src={`/arbitrary/THUMBNAIL/${qortalMetadata?.name}/qortal_avatar`}
              alt={`${qortalMetadata?.name}'s avatar`}
            />
            <VideoCardName
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {qortalMetadata?.name}
            </VideoCardName>
          </NameContainer>
          {qortalMetadata?.created && (
            <Box sx={{ flexDirection: "row", width: "100%" }}>
              <VideoUploadDate sx={{ display: "inline" }}>
                {formatDate(qortalMetadata.created)}
              </VideoUploadDate>
            </Box>
          )}
        </BottomParent>
      </VideoCard>
    </VideoCardCol>
  );
}
