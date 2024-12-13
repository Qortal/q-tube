import { useSelector } from "react-redux";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { RootState } from "../../../state/store.ts";
import { ChannelParams } from "./ChannelName.tsx";
import { StyledCardColComment } from "./VideoContent-styles.tsx";

export const ChannelButtons = ({ channelName, sx }: ChannelParams) => {
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return (
    <StyledCardColComment sx={{ alignItems: "center", ...sx }}>
      {channelName !== userName && (
        <>
          <SubscribeButton subscriberName={channelName} />
          <FollowButton
            followerName={channelName}
            sx={{ marginLeft: "20px" }}
          />
        </>
      )}
    </StyledCardColComment>
  );
};
