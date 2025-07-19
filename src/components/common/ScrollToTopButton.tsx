import React, { useEffect, useState, RefObject } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {
  scrollRef: RefObject<HTMLElement> | null;
}

export const ScrollToTopButton: React.FC<Props> = ({ scrollRef }) => {
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
    const handleMouseMove = () => {
      setUserActive(true);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => setUserActive(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove(); // trigger on mount

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
