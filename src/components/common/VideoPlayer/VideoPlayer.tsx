import { useSignals } from "@preact/signals-react/runtime";
import CSS from "csstype";
import { forwardRef } from "react";
import { LoadingVideo } from "./Components/LoadingVideo.tsx";
import { useContextData, VideoContext } from "./Components/VideoContext.ts";
import { VideoControls } from "./Components/VideoControls.tsx";
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
}

export type videoRefType = {
  getContainerRef: () => React.MutableRefObject<HTMLDivElement>;
  getVideoRef: () => React.MutableRefObject<HTMLVideoElement>;
};
export const VideoPlayer = forwardRef<videoRefType, VideoPlayerProps>(
  (props: VideoPlayerProps, ref) => {
    useSignals();
    const contextData = useContextData(props, ref);

    const {
      keyboardShortcutsUp,
      keyboardShortcutsDown,
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
    } = contextData;

    return (
      <VideoContext.Provider value={contextData}>
        <VideoContainer
          tabIndex={0}
          onKeyUp={keyboardShortcutsUp}
          onKeyDown={keyboardShortcutsDown}
          style={{
            padding: from === "create" ? "8px" : 0,
            ...videoStyles?.videoContainer,
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
            onMouseEnter={e => {
              showControlsFullScreen.value = true;
            }}
            onMouseLeave={e => {
              showControlsFullScreen.value = false;
            }}
            preload="metadata"
            style={
              startPlay.value
                ? {
                    ...videoStyles?.video,
                    objectFit: videoObjectFit.value,
                  }
                : { height: "100%", ...videoStyles }
            }
          />
          <VideoControls />
        </VideoContainer>
      </VideoContext.Provider>
    );
  }
);
