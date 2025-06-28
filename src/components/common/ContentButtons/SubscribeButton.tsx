import { Button, ButtonProps } from '@mui/material';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscriptionListFilter } from '../../../App-Functions.ts';
import { RootState } from '../../../state/store.ts';
import {
  subscribe,
  unSubscribe,
} from '../../../state/features/persistSlice.ts';
import { setFilteredSubscriptions } from '../../../state/features/videoSlice.ts';
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
  const dispatch = useDispatch();
  const [subscriptions, setSubscriptions, isHydratedSubscriptions] =
    usePersistedState('subscriptions', []);
  const filteredSubscriptionList = useSelector((state: RootState) => {
    return state.video.filteredSubscriptionList;
  });

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
  const subscribeToRedux = () => {
    dispatch(subscribe(subscriptionData));
    dispatch(
      setFilteredSubscriptions([...filteredSubscriptionList, subscriptionData])
    );
    setSubscriptions((prev) => [...prev, subscriptionData]);
  };
  const unSubscribeFromRedux = () => {
    setSubscriptions((prev) =>
      prev.filter(
        (item) => item.subscriberName !== subscriptionData.subscriberName
      )
    );
  };

  const manageSubscription = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isSubscribed ? unSubscribeFromRedux() : subscribeToRedux();
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
        color="error"
        sx={buttonStyle}
        onClick={(e) => manageSubscription(e)}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
    </CustomTooltip>
  );
};
