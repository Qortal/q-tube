import { Avatar, Box, useTheme } from "@mui/material";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { RootState } from "../../../state/store.ts";
import {
  AuthorTextComment,
  StyledCardColComment,
  StyledCardHeaderComment,
} from "./VideoContent-styles.tsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export interface ChannelActionsParams {
  channelName: string;
}
export const ChannelActions = ({ channelName }: ChannelActionsParams) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return (
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
  );
};
