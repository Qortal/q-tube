import { createContext, useContext } from "react";
import { useVideoPlayerState } from "../VideoPlayer-State.ts";
import { VideoPlayerProps } from "../VideoPlayer.tsx";
import { useVideoControlsState } from "./VideoControls-State.ts";

export type VideoContextType = VideoPlayerProps &
  ReturnType<typeof useVideoPlayerState> &
  ReturnType<typeof useVideoControlsState>;

export const VideoContext = createContext<VideoContextType | undefined>(
  undefined
);
export const useContextData = (props, ref) => {
  const videoState = useVideoPlayerState(props, ref);
  const controlState = useVideoControlsState(props, videoState);

  return {
    ...props,
    ...videoState,
    ...controlState,
  };
};

export const useVideoContext = () => {
  const context = useContext<VideoContextType>(VideoContext);
  if (!context) throw new Error("VideoContext is NULL");
  return context;
};
