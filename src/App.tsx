import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Notification from './components/common/Notification/Notification';

import { darkTheme } from './styles/theme';

import { Routes } from './Routes.tsx';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Notification />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
