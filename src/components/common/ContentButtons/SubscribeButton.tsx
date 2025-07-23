import { Button, ButtonProps, darken, lighten } from '@mui/material';
import { MouseEvent, useMemo } from 'react';

import { CustomTooltip, TooltipLine } from './CustomTooltip.tsx';
import { useAuth, useGlobal } from 'qapp-core';
import { usePersistedState } from '../../../state/persist/persist.ts';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['core']);

  const { lists } = useGlobal();
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
    lists.deleteList('subscriptions');
  };
  const unSubscribe = () => {
    setSubscriptions((prev) =>
      prev.filter(
        (item) => item.subscriberName !== subscriptionData.subscriberName
      )
    );
    lists.deleteList('subscriptions');
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
        {t('core:video.subscribe_description', {
          postProcess: 'capitalizeFirstChar',
        })}
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
        {isSubscribed
          ? t('core:action.unsubscribe', {
              postProcess: 'capitalizeFirstChar',
            })
          : t('core:video.subscribe', {
              postProcess: 'capitalizeFirstChar',
            })}
      </Button>
    </CustomTooltip>
  );
};
