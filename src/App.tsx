import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { subscriptionListFilter } from './App-Functions.ts';
import Notification from './components/common/Notification/Notification';

import { setFilteredSubscriptions } from './state/features/videoSlice.ts';
import { store, persistor } from './state/store';
import { darkTheme } from './styles/theme';
import DownloadWrapper from './wrappers/DownloadWrapper';

import { Routes } from './Routes.tsx';

function App() {
  useEffect(() => {
    subscriptionListFilter(false).then((filteredList) => {
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
