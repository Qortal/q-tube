import { Box } from "@mui/material";
import { ControlsContainer } from "../VideoPlayer-styles.ts";
import { MobileControlsBar } from "./MobileControlsBar.tsx";
import { useVideoContext } from "./VideoContext.ts";
import {
  FullscreenButton,
  ObjectFitButton,
  PictureInPictureButton,
  PlaybackRate,
  PlayButton,
  ProgressSlider,
  ReloadButton,
  VideoTime,
  VolumeControl,
} from "./VideoControls.tsx";

export const VideoControlsBar = () => {
  const { canPlay, isScreenSmall, controlsHeight } = useVideoContext();

  const showMobileControls = isScreenSmall && canPlay.value;

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

            <VolumeControl sliderWidth={"100px"} />
            <VideoTime />
          </Box>

          <Box sx={controlGroupSX}>
            <PlaybackRate />
            <ObjectFitButton />
            <PictureInPictureButton />
            <FullscreenButton />
          </Box>
        </>
      ) : null}
    </ControlsContainer>
  );
};
