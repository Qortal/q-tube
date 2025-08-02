import React, { useEffect, useState, RefObject } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useIsSmall } from '../../hooks/useIsSmall';

interface Props {
  scrollRef: RefObject<HTMLElement> | null;
}

export const ScrollToTopButton: React.FC<Props> = ({ scrollRef }) => {
  const isSmall = useIsSmall();
  const [visible, setVisible] = useState(false);
  const [userActive, setUserActive] = useState(true);
  let inactivityTimer: ReturnType<typeof setTimeout>;

  // Scroll listener on the passed container
  useEffect(() => {
    if (!scrollRef) return;
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setVisible(el.scrollTop > 100);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check

    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  // Mouse activity listener
  useEffect(() => {
    const handleActivity = () => {
      setUserActive(true);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => setUserActive(false), 3000);
    };

    window.addEventListener('mousemove', handleActivity); // desktop
    window.addEventListener('touchstart', handleActivity); // mobile tap
    window.addEventListener('scroll', handleActivity, true); // any scroll

    handleActivity(); // run on mount

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity, true);
      clearTimeout(inactivityTimer);
    };
  }, []);

  const scrollToTop = () => {
    if (!scrollRef) return;
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible && userActive}>
      <Fab
        size={isSmall ? 'small' : 'large'}
        color="primary"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};
