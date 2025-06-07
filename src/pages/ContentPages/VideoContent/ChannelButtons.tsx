import { useSelector } from "react-redux";
import { FollowButton } from "../../../components/common/ContentButtons/FollowButton.tsx";
import { SubscribeButton } from "../../../components/common/ContentButtons/SubscribeButton.tsx";
import { RootState } from "../../../state/store.ts";
import { ChannelParams } from "./ChannelName.tsx";
import { StyledCardColComment } from "./VideoContent-styles.tsx";
import { namesAtom } from '../../../state/global/names';
import { useAtom } from "jotai";

export const ChannelButtons = ({ channelName, sx }: ChannelParams) => {

  const [names] = useAtom(namesAtom);
  const isInNames = names.map((name) => name.name ).includes(channelName);
  
  //const userName = useSelector((state: RootState) => state.auth.user?.name);
  // We need to put a change in here to get the currentUser name, not from the Redux state
  return (
    <StyledCardColComment sx={{ alignItems: "center", ...sx }}>
        {!isInNames && (
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
