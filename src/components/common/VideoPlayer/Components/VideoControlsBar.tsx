import { Box } from "@mui/material";
import { ControlsContainer } from "../VideoPlayer-styles.ts";
import { MobileControlsBar } from "./MobileControlsBar.tsx";
import { useVideoContext } from "./VideoContext.ts";
import {
  FullscreenButton,
  PictureInPictureButton,
  PlaybackRate,
  PlayButton,
  ProgressSlider,
  ReloadButton,
  VideoTime,
  VolumeButton,
  VolumeSlider,
} from "./VideoControls.tsx";
import { useSignalEffect } from "@preact/signals-react";

export const VideoControlsBar = () => {
  const { from, canPlay, showControlsFullScreen, isScreenSmall, progress } =
    useVideoContext();

  const showMobileControls = isScreenSmall && canPlay.value;
  const controlsHeight = "40px";
  const controlGroupSX = {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    height: controlsHeight,
  };

  return (
    <ControlsContainer
      style={{
        padding: "0px",
        height: controlsHeight,
      }}
    >
      {showMobileControls ? (
        <MobileControlsBar />
      ) : canPlay.value ? (
        <>
          <Box sx={controlGroupSX}>
            <PlayButton />
            <ReloadButton />

            <ProgressSlider />

            <VolumeButton />
            <VolumeSlider />
            <VideoTime />
          </Box>

          <Box sx={controlGroupSX}>
            <PlaybackRate />
            <PictureInPictureButton />
            <FullscreenButton />
          </Box>
        </>
      ) : null}
    </ControlsContainer>
  );
};
