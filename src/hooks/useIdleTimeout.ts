import { useContext, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

const useIdleTimeout = ({ onIdle, onActive, idleTime = 10_000 }) => {
  const idleTimer = useIdleTimer({
    timeout: idleTime,
    onIdle: onIdle,
    onActive: onActive,
  });
  return {
    idleTimer,
  };
};
export default useIdleTimeout;
