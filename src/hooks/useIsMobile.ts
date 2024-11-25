import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";

const isMobile = signal(false);
const isDeviceDetermined = signal(false);

export const useIsMobile = () => {
  if (isDeviceDetermined.value) return isMobile.value;

  const userAgent = navigator.userAgent || navigator.vendor;

  isMobile.value =
    /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent);

  const deviceTypeText = isMobile.value ? "Mobile Device" : "Desktop";
  console.log("Running on a", deviceTypeText);

  isDeviceDetermined.value = true;
  return isMobile.value;
};
