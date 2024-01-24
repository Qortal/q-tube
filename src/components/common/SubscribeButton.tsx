import { Button, ButtonProps } from "@mui/material";
import { MouseEvent } from "react";

interface SubscribeButtonProps extends ButtonProps {
  name: string;
}

const isSubscribed = false;
export const SubscribeButton = ({ name, ...props }: SubscribeButtonProps) => {
  const manageSubscription = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("subscribed to: ", name);
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
    display: "none",
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
