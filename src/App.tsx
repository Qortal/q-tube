import Notification from './components/common/Notification/Notification';

import { Routes } from './Routes.tsx';
import ThemeProviderWrapper from './styles/theme-provider.tsx';

function App() {
  return (
    <ThemeProviderWrapper>
      <Notification />
      <Routes />
    </ThemeProviderWrapper>
  );
}

export default App;
