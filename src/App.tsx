import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { useAppState } from "./App-State.ts";
import Notification from "./components/common/Notification/Notification";
import { IndividualProfile } from "./pages/ContentPages/IndividualProfile/IndividualProfile";
import { PlaylistContent } from "./pages/ContentPages/PlaylistContent/PlaylistContent";
import { VideoContent } from "./pages/ContentPages/VideoContent/VideoContent";
import { Home } from "./pages/Home/Home";
import { store } from "./state/store";
import { darkTheme, lightTheme } from "./styles/theme";
import DownloadWrapper from "./wrappers/DownloadWrapper";
import GlobalWrapper from "./wrappers/GlobalWrapper";
import { ScrollWrapper } from "./wrappers/ScrollWrapper.tsx";

function App() {
  // const themeColor = window._qdnTheme
  const { persistor, theme, setTheme } = useAppState();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <Notification />
          <DownloadWrapper>
            <GlobalWrapper setTheme={(val: string) => setTheme(val)}>
              <ScrollWrapper>
                <CssBaseline />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/video/:name/:id" element={<VideoContent />} />
                  <Route
                    path="/playlist/:name/:id"
                    element={<PlaylistContent />}
                  />
                  <Route
                    path="/channel/:name"
                    element={<IndividualProfile />}
                  />
                </Routes>
              </ScrollWrapper>
            </GlobalWrapper>
          </DownloadWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
