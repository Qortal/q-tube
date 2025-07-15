import { Outlet } from 'react-router-dom';
import { useIframe } from './hooks/useIframe';
import { Box, useTheme } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { isSideBarExpandedAtom, scrollRefAtom } from './state/global/navbar';

import NavBar from './components/layout/Navbar/Navbar';
import { Sidenav } from './components/layout/Sidenav/Sidenav';
import { namesAtom } from './state/global/names';
import { useEffect, useRef } from 'react';

const Layout = () => {
  const scrollRef = useRef<any>(null);
  const setScrollRef = useSetAtom(scrollRefAtom);
  const theme = useTheme();
  useEffect(() => {
    setScrollRef(scrollRef);
  }, [setScrollRef]);

  const [names] = useAtom(namesAtom);

  useIframe();

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <NavBar allNames={names} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Sidenav />

        {/* Main Content */}

        <Box
          ref={scrollRef}
          id="main-box"
          component="main"
          flex={1}
          p={2}
          sx={{
            overflowY: 'scroll',
            '::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },

            '::-webkit-scrollbar': {
              width: '16px',
              height: '10px',
            },

            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(63, 67, 80, 0.24)',
              borderRadius: '8px',
              backgroundClip: 'content-box',
              border: '4px solid transparent',
              transition: '0.3s background-color',
            },
            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(63, 67, 80, 0.50)',
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
