import { Button, ButtonProps, Tooltip } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscriptionListFilter } from "../../../App-State.ts";
import { RootState } from "../../../state/store.ts";
import {
  subscribe,
  unSubscribe,
} from "../../../state/features/persistSlice.ts";
import { setFilteredSubscriptions } from "../../../state/features/videoSlice.ts";
import { styled } from "@mui/material/styles";

interface SubscribeButtonProps extends ButtonProps {
  subscriberName: string;
}

export type SubscriptionData = {
  userName: string;
  subscriberName: string;
};

export const SubscribeButton = ({
  subscriberName,
  ...props
}: SubscribeButtonProps) => {
  const dispatch = useDispatch();

  const filteredSubscriptionList = useSelector((state: RootState) => {
    return state.video.filteredSubscriptionList;
  });

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const isSubscribedToName = (subscriptionList: SubscriptionData[]) => {
    return (
      subscriptionList.find(item => {
        return item.subscriberName === subscriberName;
      }) !== undefined
    );
  };

  useEffect(() => {
    if (!filteredSubscriptionList || filteredSubscriptionList.length === 0) {
      subscriptionListFilter().then(filteredList => {
        dispatch(setFilteredSubscriptions(filteredList));
        setIsSubscribed(isSubscribedToName(filteredList));
      });
    } else {
      setIsSubscribed(isSubscribedToName(filteredSubscriptionList));
    }
  }, []);

  const subscriptionData: SubscriptionData = {
    userName: userName,
    subscriberName: subscriberName,
  };
  const subscribeToRedux = () => {
    dispatch(subscribe(subscriptionData));
    dispatch(
      setFilteredSubscriptions([...filteredSubscriptionList, subscriptionData])
    );
    setIsSubscribed(true);
  };
  const unSubscribeFromRedux = () => {
    dispatch(unSubscribe(subscriptionData));
    dispatch(
      setFilteredSubscriptions(
        filteredSubscriptionList.filter(
          item => item.subscriberName !== subscriptionData.subscriberName
        )
      )
    );
    setIsSubscribed(false);
  };

  const manageSubscription = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isSubscribed ? unSubscribeFromRedux() : subscribeToRedux();
  };

  const verticalPadding = "3px";
  const horizontalPadding = "8px";
  const buttonStyle = {
    fontSize: "15px",
    fontWeight: "700",
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    borderRadius: 28,
    height: "45px",
    ...props.sx,
  };

  const TooltipLine = styled("div")(({ theme }) => ({
    fontSize: "18px",
  }));

  const tooltipTitle = (
    <>
      <TooltipLine>
        Subscribing to a name lets you see their content on the Subscriptions
        tab of the Home Page. This does NOT download any data to your node.
      </TooltipLine>
    </>
  );

  return (
    <Tooltip title={tooltipTitle} placement={"top"} arrow>
      <Button
        {...props}
        variant={"contained"}
        color="error"
        sx={buttonStyle}
        onClick={e => manageSubscription(e)}
      >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </Button>
    </Tooltip>
  );
};
