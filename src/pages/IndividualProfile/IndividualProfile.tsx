import React, { useMemo } from "react";
import { VideoListComponentLevel } from "../Home/VideoListComponentLevel";
import { HeaderContainer, ProfileContainer } from "./Profile-styles";
import {
  AuthorTextComment,
  StyledCardColComment,
  StyledCardHeaderComment,
} from "../VideoContent/VideoContent-styles";
import { Avatar, Box, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setUserAvatarHash } from "../../state/features/globalSlice";
import { RootState } from "../../state/store";
import { SubscribeButton } from "../../components/common/SubscribeButton.tsx";

export const IndividualProfile = () => {
  const { name: paramName } = useParams();

  const userAvatarHash = useSelector(
    (state: RootState) => state.global.userAvatarHash
  );
  const theme = useTheme();

  const avatarUrl = useMemo(() => {
    let url = "";
    if (paramName && userAvatarHash[paramName]) {
      url = userAvatarHash[paramName];
    }

    return url;
  }, [userAvatarHash, paramName]);
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
                src={`/arbitrary/THUMBNAIL/${paramName}/qortal_avatar`}
                alt={`${paramName}'s avatar`}
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
                {paramName}
              </AuthorTextComment>
            </StyledCardColComment>
            <SubscribeButton
              subscriberName={paramName}
              sx={{ marginLeft: "10px" }}
            />
          </StyledCardHeaderComment>
        </Box>
      </HeaderContainer>
      <VideoListComponentLevel />
    </ProfileContainer>
  );
};
