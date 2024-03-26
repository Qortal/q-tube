import React, { useMemo } from "react";
import { VideoListComponentLevel } from "../../Home/VideoListComponentLevel.tsx";
import { HeaderContainer, ProfileContainer } from "./Profile-styles.tsx";
import {
  AuthorTextComment,
  StyledCardColComment,
  StyledCardHeaderComment,
} from "../VideoContent/VideoContent-styles.tsx";
import { Avatar, Box, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setUserAvatarHash } from "../../../state/features/globalSlice.ts";
import { RootState } from "../../../state/store.ts";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";

export const IndividualProfile = () => {
  const { name: channelName } = useParams();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );

  const theme = useTheme();

  const avatarUrl = useMemo(() => {
    let url = "";
    if (channelName && userAvatarHash[channelName]) {
      url = userAvatarHash[channelName];
    }

    return url;
  }, [userAvatarHash, channelName]);
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
            <Box>
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
              >
                {channelName}
              </AuthorTextComment>
            </StyledCardColComment>
            {channelName !== userName && (
              <>
                <SubscribeButton
                  subscriberName={channelName}
                  sx={{ marginLeft: "10px" }}
                />
                <FollowButton
                  followerName={channelName}
                  sx={{ marginLeft: "20px" }}
                />
              </>
            )}
          </StyledCardHeaderComment>
        </Box>
      </HeaderContainer>
      <VideoListComponentLevel />
    </ProfileContainer>
  );
};
