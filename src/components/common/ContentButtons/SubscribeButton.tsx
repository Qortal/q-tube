import { Button, ButtonProps, darken, lighten } from '@mui/material';
import { MouseEvent, useMemo } from 'react';

import { CustomTooltip, TooltipLine } from './CustomTooltip.tsx';
import { useAuth } from 'qapp-core';
import { usePersistedState } from '../../../state/persist/persist.ts';

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
  const [subscriptions, setSubscriptions, isHydratedSubscriptions] =
    usePersistedState('subscriptions', []);

  const { name } = useAuth();
  const userName = name;
  const isSubscribed = useMemo(() => {
    return (
      subscriptions.find((item) => {
        return item.subscriberName === subscriberName;
      }) !== undefined
    );
  }, [subscriptions]);
  const subscriptionData: SubscriptionData = {
    userName: userName,
    subscriberName: subscriberName,
  };
  const subscribeTo = () => {
    setSubscriptions((prev) => [...prev, subscriptionData]);
  };
  const unSubscribe = () => {
    setSubscriptions((prev) =>
      prev.filter(
        (item) => item.subscriberName !== subscriptionData.subscriberName
      )
    );
  };

  const manageSubscription = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isSubscribed ? unSubscribe() : subscribeTo();
  };

  const verticalPadding = '3px';
  const horizontalPadding = '8px';
  const buttonStyle = {
    fontSize: '15px',
    fontWeight: '700',
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    borderRadius: 28,
    height: '45px',
    ...props.sx,
  };

  const tooltipTitle = (
    <>
      <TooltipLine>
        Subscribing to a name lets you see their content on the Subscriptions
        tab of the Home Page. This does NOT download any data to your node.
      </TooltipLine>
    </>
  );

  return (
    <CustomTooltip title={tooltipTitle} placement={'top'} arrow>
      <Button
        {...props}
        variant={'contained'}
        disabled={!isHydratedSubscriptions}
        // color="error"
        // sx={buttonStyle}
        color="info"
        onClick={(e) => manageSubscription(e)}
        sx={(theme) => {
          const baseColor = theme.palette.info.main;
          return {
            minWidth: '125px',
            backgroundColor: isSubscribed ? darken(baseColor, 0.7) : baseColor,
          };
        }}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
    </CustomTooltip>
  );
};
