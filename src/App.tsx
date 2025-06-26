import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { subscriptionListFilter } from "./App-Functions.ts";
import Notification from "./components/common/Notification/Notification";
import { useIframe } from "./hooks/useIframe.tsx";
import { IndividualProfile } from "./pages/ContentPages/IndividualProfile/IndividualProfile";
import { PlaylistContent } from "./pages/ContentPages/PlaylistContent/PlaylistContent";
import { VideoContent } from "./pages/ContentPages/VideoContent/VideoContent";
import { Home } from "./pages/Home/Home";
import { setFilteredSubscriptions } from "./state/features/videoSlice.ts";
import { store, persistor, RootState } from "./state/store";
import { darkTheme, lightTheme } from "./styles/theme";
import DownloadWrapper from "./wrappers/DownloadWrapper";
import GlobalWrapper from "./wrappers/GlobalWrapper";
import { ScrollWrapper } from "./wrappers/ScrollWrapper.tsx";
import { QappCoreWrapper } from "./QappCoreWrapper.tsx";
import { Routes } from "./Routes.tsx";

function App() {
  // const themeColor = window._qdnTheme


  // useIframe();

  useEffect(() => {
    subscriptionListFilter(false).then(filteredList => {
      store.dispatch(setFilteredSubscriptions(filteredList));
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={darkTheme}>
             <CssBaseline />
          <Notification />
          <DownloadWrapper>
            
             
                <Routes />
            
          </DownloadWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
