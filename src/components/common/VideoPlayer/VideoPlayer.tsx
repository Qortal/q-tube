import CSS from "csstype";
import { forwardRef } from "react";
import useIdleTimeout from "../../../hooks/useIdleTimeout.ts";
import { LoadingVideo } from "./Components/LoadingVideo.tsx";
import { useContextData, VideoContext } from "./Components/VideoContext.ts";
import { VideoControlsBar } from "./Components/VideoControlsBar.tsx";
import { VideoContainer, VideoElement } from "./VideoPlayer-styles.ts";

export interface VideoStyles {
  videoContainer?: CSS.Properties;
  video?: CSS.Properties;
  controls?: CSS.Properties;
}
export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  name?: string;
  identifier?: string;
  service?: string;
  autoplay?: boolean;
  from?: string | null;
  videoStyles?: VideoStyles;
  user?: string;
  jsonId?: string;
  nextVideo?: any;
  onEnd?: () => void;
  autoPlay?: boolean;
  style?: CSS.Properties;
  duration?: number;
}

export type videoRefType = {
  getContainerRef: () => React.MutableRefObject<HTMLDivElement>;
  getVideoRef: () => React.MutableRefObject<HTMLVideoElement>;
};
export const VideoPlayer = forwardRef<videoRefType, VideoPlayerProps>(
  (props: VideoPlayerProps, ref) => {
    const contextData = useContextData(props, ref);

    const {
      keyboardShortcuts,
      from,
      videoStyles,
      containerRef,
      resourceStatus,
      src,
      togglePlay,
      identifier,
      videoRef,
      poster,
      updateProgress,
      autoplay,
      handleEnded,
      handleCanPlay,
      startPlay,
      videoObjectFit,
      showControlsFullScreen,
      isFullscreen,
    } = contextData;

    const showControls =
      !isFullscreen.value ||
      (isFullscreen.value && showControlsFullScreen.value);

    const idleTime = 5000; // Time in milliseconds
    useIdleTimeout({
      onIdle: () => (showControlsFullScreen.value = false),
      onActive: () => (showControlsFullScreen.value = true),
      idleTime,
    });

    return (
      <VideoContext.Provider value={contextData}>
        <VideoContainer
          tabIndex={0}
          onKeyDown={keyboardShortcuts}
          style={{
            padding: from === "create" ? "8px" : 0,
            ...videoStyles?.videoContainer,
          }}
          onMouseEnter={e => {
            showControlsFullScreen.value = true;
          }}
          onMouseLeave={e => {
            showControlsFullScreen.value = false;
          }}
          ref={containerRef}
        >
          <LoadingVideo />
          <VideoElement
            id={identifier}
            ref={videoRef}
            src={
              resourceStatus?.status === "READY" && startPlay.value ? src : ""
            }
            poster={startPlay.value ? "" : poster}
            onTimeUpdate={updateProgress}
            autoPlay={autoplay}
            onClick={() => togglePlay()}
            onEnded={handleEnded}
            // onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            preload="metadata"
            style={{
              ...videoStyles?.video,
              objectFit: isFullscreen ? "fill" : videoObjectFit.value,
              height:
                isFullscreen.value && showControlsFullScreen.value
                  ? "calc(100vh - 40px)"
                  : "100%",
            }}
          />
          {showControls && <VideoControlsBar />}
        </VideoContainer>
      </VideoContext.Provider>
    );
  }
);
