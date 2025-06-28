import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import Notification from './components/common/Notification/Notification';

import { store, persistor } from './state/store';
import { darkTheme } from './styles/theme';

import { Routes } from './Routes.tsx';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Notification />
        <Routes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
