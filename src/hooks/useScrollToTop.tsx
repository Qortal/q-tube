import { useEffect } from 'react';

export const useScrollToTop = (selector: string = '#main-box') => {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollTo({ top: 0, behavior: 'auto' }); // 'auto' for instant
    }
  }, []);
};
