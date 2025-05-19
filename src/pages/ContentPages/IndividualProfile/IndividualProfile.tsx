import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { VideoListComponentLevel } from "../../Home/Components/VideoListComponentLevel.tsx";
import { PlayListComponentLevel } from "../../Home/Components/PlayListComponentLevel.tsx";
import { ChannelActions } from "../VideoContent/ChannelActions.tsx";
import { StyledCardHeaderComment } from "../VideoContent/VideoContent-styles.tsx";
import { HeaderContainer, ProfileContainer } from "./Profile-styles.tsx";

export const IndividualProfile = () => {
  const { name: channelName } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

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

      {/* Tabs Bar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Videos" />
          <Tab label="Playlists" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && <VideoListComponentLevel />}
      {selectedTab === 1 && <PlayListComponentLevel />}

    </ProfileContainer>
  );
};
