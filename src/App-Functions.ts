import { SubscriptionData } from './components/common/ContentButtons/SubscribeButton.tsx';

export const getUserName = async () => {
  const account = await qortalRequest({
    action: 'GET_USER_ACCOUNT',
  });
  const nameData = await qortalRequest({
    action: 'GET_ACCOUNT_NAMES',
    address: account.address,
  });

  if (nameData?.length > 0) return nameData[0].name;
  else return '';
};

export const filterVideosByName = (
  subscriptionList: SubscriptionData[],
  userName: string
) => {
  return subscriptionList.filter((item) => {
    return item.userName === userName;
  });
};
