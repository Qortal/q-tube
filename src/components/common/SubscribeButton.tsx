import { Button, ButtonProps } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { subscribe, unSubscribe } from "../../state/features/videoSlice.ts";

interface SubscribeButtonProps extends ButtonProps {
  name: string;
}

export const SubscribeButton = ({ name, ...props }: SubscribeButtonProps) => {
  const dispatch = useDispatch();
  const select = useSelector((state: RootState) => {
    return state.video;
  });
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    setIsSubscribed(select.subscriptionList.includes(name));
  }, []);

  const subscribeToRedux = () => {
    dispatch(subscribe(name));
    setIsSubscribed(true);
  };
  const unSubscribeFromRedux = () => {
    dispatch(unSubscribe(name));
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
    ...props.sx,
    fontSize: "15px",
    fontWeight: "700",
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    borderRadius: 28,
    height: "40px",
  };
  return (
    <Button
      {...props}
      variant={"contained"}
      color="error"
      sx={buttonStyle}
      onClick={e => manageSubscription(e)}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
