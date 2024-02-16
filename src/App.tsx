import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./styles/theme";
import { store } from "./state/store";
import { Provider } from "react-redux";
import GlobalWrapper from "./wrappers/GlobalWrapper";
import Notification from "./components/common/Notification/Notification";
import { Home } from "./pages/Home/Home";
import { VideoContent } from "./pages/VideoContent/VideoContent";
import DownloadWrapper from "./wrappers/DownloadWrapper";
import { IndividualProfile } from "./pages/IndividualProfile/IndividualProfile";
import { PlaylistContent } from "./pages/PlaylistContent/PlaylistContent";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { setFilteredSubscriptions } from "./state/features/videoSlice.ts";
import { SubscriptionObject } from "./state/features/persistSlice.ts";

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
  subscriptionList: SubscriptionObject[],
  userName: string
) => {
  return subscriptionList.filter(item => {
    return item.userName === userName;
  });
};

export const subscriptionListFilter = async () => {
  const subscriptionList = store.getState().persist.subscriptionList;
  const filterByUserName =
    store.getState().persist.subscriptionListFilter === "currentNameOnly";
  const userName = await getUserName();

  if (filterByUserName && userName) {
    return filterVideosByName(subscriptionList, userName);
  } else return subscriptionList;
};

function App() {
  // const themeColor = window._qdnTheme

  const [theme, setTheme] = useState("dark");
  let persistor = persistStore(store);

  useEffect(() => {
    const subscriptionList = store.getState().persist.subscriptionList;
    subscriptionListFilter().then(filteredList => {
      store.dispatch(setFilteredSubscriptions(filteredList));
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <Notification />
          <DownloadWrapper>
            <GlobalWrapper setTheme={(val: string) => setTheme(val)}>
              <CssBaseline />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video/:name/:id" element={<VideoContent />} />
                <Route
                  path="/playlist/:name/:id"
                  element={<PlaylistContent />}
                />
                <Route path="/channel/:name" element={<IndividualProfile />} />
              </Routes>
            </GlobalWrapper>
          </DownloadWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
