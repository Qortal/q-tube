import { useEffect, useState } from "react";
import { SubscriptionData } from "./components/common/ContentButtons/SubscribeButton.tsx";
import { setFilteredSubscriptions } from "./state/features/videoSlice.ts";
import { store } from "./state/store.ts";
import { persistStore } from "redux-persist";

export const useAppState = () => {
  const [theme, setTheme] = useState("dark");
  const persistor = persistStore(store);

  useEffect(() => {
    subscriptionListFilter(false).then(filteredList => {
      store.dispatch(setFilteredSubscriptions(filteredList));
    });
  }, []);
  return { persistor, theme, setTheme };
};

export const getUserName = async () => {
  const account = await qortalRequest({
    action: "GET_USER_ACCOUNT",
  });
  const nameData = await qortalRequest({
    action: "GET_ACCOUNT_NAMES",
    address: account.address,
  });

  if (nameData?.length > 0) return nameData[0].name;
  else return "";
};
export const filterVideosByName = (
  subscriptionList: SubscriptionData[],
  userName: string
) => {
  return subscriptionList.filter(item => {
    return item.userName === userName;
  });
};
export const subscriptionListFilter = async (reset = true) => {
  const filteredSubscriptionList =
    store.getState().video.filteredSubscriptionList;
  const isFilteredSubscriptionListEmpty = filteredSubscriptionList.length === 0;

  if (!reset && !isFilteredSubscriptionListEmpty) {
    return filteredSubscriptionList;
  }

  const subscriptionList = store.getState().persist.subscriptionList;
  const filterByUserName =
    store.getState().persist.subscriptionListFilter === "currentNameOnly";
  const userName = await getUserName();

  if (filterByUserName && userName) {
    return filterVideosByName(subscriptionList, userName);
  } else return subscriptionList;
};
