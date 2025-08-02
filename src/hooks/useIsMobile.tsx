export const useIsMobile = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
