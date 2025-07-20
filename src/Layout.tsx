import { Outlet } from 'react-router-dom';
import { useIframe } from './hooks/useIframe';
import { Box, useTheme } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { isSideBarExpandedAtom, scrollRefAtom } from './state/global/navbar';

import NavBar from './components/layout/Navbar/Navbar';
import { Sidenav } from './components/layout/Sidenav/Sidenav';
import { namesAtom } from './state/global/names';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/common/PageTransition';
import { useIsSmall } from './hooks/useIsSmall';
import { useIsMobile } from './hooks/useIsMobile';

const Layout = () => {
  const isSmall = useIsSmall();
  const isMobile = useIsMobile();
  const scrollRef = useRef<any>(null);
  const setScrollRef = useSetAtom(scrollRefAtom);
  const theme = useTheme();
  useEffect(() => {
    setScrollRef(scrollRef);
  }, [setScrollRef]);

  const [names] = useAtom(namesAtom);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  useIframe();

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let lastY = 0;
    let ticking = false;

    const handleScroll = () => {
      const currentY = scrollElement.scrollTop;
      const deltaY = currentY - lastY;

      if (Math.abs(deltaY) < 70) {
        ticking = false;
        return; // skip tiny scrolls
      }

      if (deltaY > 0 && currentY > 50) {
        setShowNavbar(false); // scroll down
      } else {
        setShowNavbar(true); // scroll up
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    scrollElement.addEventListener('scroll', onScroll);
    return () => scrollElement.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <AnimatePresence>
        <motion.div
          animate={
            showNavbar
              ? { height: '64px', opacity: 1, y: 0 }
              : { height: '0px', opacity: 0, y: -20 }
          }
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          <NavBar allNames={names} />
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Sidenav allNames={names} />

        {/* Main Content */}

        <Box
          ref={scrollRef}
          id="main-box"
          component="main"
          flex={1}
          p={isMobile ? 0 : 2}
          sx={{
            overflowY: 'scroll',
            '::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },

            '::-webkit-scrollbar': {
              width: isMobile ? '0px' : '16px',
              height: '10px',
              display: isMobile ? 'none' : 'initial',
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
