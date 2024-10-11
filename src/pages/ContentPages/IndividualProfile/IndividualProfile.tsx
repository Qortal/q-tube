import { Box } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { VideoListComponentLevel } from "../../Home/Components/VideoListComponentLevel.tsx";
import { ChannelActions } from "../VideoContent/ChannelActions.tsx";
import { StyledCardHeaderComment } from "../VideoContent/VideoContent-styles.tsx";
import { HeaderContainer, ProfileContainer } from "./Profile-styles.tsx";

export const IndividualProfile = () => {
  const { name: channelName } = useParams();

  return (
    <ProfileContainer>
      <HeaderContainer>
        <Box
          sx={{
            cursor: "pointer",
          }}
        >
          <StyledCardHeaderComment
            sx={{
              "& .MuiCardHeader-content": {
                overflow: "hidden",
              },
            }}
          >
            <ChannelActions channelName={channelName} />
          </StyledCardHeaderComment>
        </Box>
      </HeaderContainer>
      <VideoListComponentLevel />
    </ProfileContainer>
  );
};
