import { IconButton, Slider, Typography } from "@mui/material";
import { fontSizeExSmall, fontSizeSmall } from "../../../../constants/Misc.ts";
import { CustomFontTooltip } from "../../../../utils/CustomFontTooltip.tsx";
import { formatTime } from "../../../../utils/numberFunctions.ts";
import { useVideoContext } from "./VideoContext.ts";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import {
  Fullscreen,
  Pause,
  PictureInPicture,
  PlayArrow,
  Refresh,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { useSignalEffect } from "@preact/signals-react";

export const PlayButton = () => {
  const { togglePlay, playing } = useVideoContext();
  return (
    <CustomFontTooltip title="Pause/Play (Spacebar)" placement="top" arrow>
      <IconButton
        sx={{
          color: "white",
        }}
        onClick={() => togglePlay()}
      >
        {playing.value ? <Pause /> : <PlayArrow />}
      </IconButton>
    </CustomFontTooltip>
  );
};

export const ReloadButton = () => {
  const { reloadVideo } = useVideoContext();
  return (
    <CustomFontTooltip title="Reload Video (R)" placement="top" arrow>
      <IconButton
        sx={{
          color: "white",
        }}
        onClick={reloadVideo}
      >
        <Refresh />
      </IconButton>
    </CustomFontTooltip>
  );
};

export const ProgressSlider = () => {
  const { progress, onProgressChange, videoRef } = useVideoContext();
  return (
    <Slider
      value={progress.value}
      onChange={onProgressChange}
      min={0}
      max={videoRef.current?.duration || 100}
      sx={{
        position: "absolute",
        bottom: "40px",
        color: "#00abff",
        padding: "0px",
        // prevents the slider from jumping up 20px in certain mobile conditions
        "@media (pointer: coarse)": { padding: "0px" },

        "& .MuiSlider-thumb": {
          backgroundColor: "#fff",
          width: "16px",
          height: "16px",
        },
        "& .MuiSlider-thumb::after": { width: "20px", height: "20px" },
        "& .MuiSlider-rail": { opacity: 0.5 },
      }}
    />
  );
};

export const VideoTime = () => {
  const { videoRef, progress, isScreenSmall } = useVideoContext();

  return (
    <CustomFontTooltip
      title="Seek video in 10% increments (0-9)"
      placement="top"
      arrow
    >
      <Typography
        sx={{
          fontSize: isScreenSmall ? fontSizeExSmall : fontSizeSmall,
          color: "white",
          visibility: !videoRef.current?.duration ? "hidden" : "visible",
          whiteSpace: "nowrap",
        }}
      >
        {videoRef.current?.duration ? formatTime(progress.value) : ""}
        {" / "}
        {videoRef.current?.duration
          ? formatTime(videoRef.current?.duration)
          : ""}
      </Typography>
    </CustomFontTooltip>
  );
};

export const VolumeButton = () => {
  const { isMuted, toggleMute } = useVideoContext();
  return (
    <CustomFontTooltip
      title="Toggle Mute (M), Raise (UP), Lower (DOWN)"
      placement="top"
      arrow
    >
      <IconButton
        sx={{
          color: "white",
          marginRight: "10px",
        }}
        onClick={toggleMute}
      >
        {isMuted.value ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </CustomFontTooltip>
  );
};

export const VolumeSlider = ({ width }: { width: string }) => {
  const { volume, onVolumeChange } = useVideoContext();
  return (
    <Slider
      value={volume.value}
      onChange={onVolumeChange}
      min={0}
      max={1}
      step={0.01}
      sx={{
        width,
        marginRight: "10px",
        "& .MuiSlider-thumb::after": { width: "25px", height: "25px" },
      }}
    />
  );
};

export const PlaybackRate = () => {
  const { playbackRate, increaseSpeed, isScreenSmall } = useVideoContext();
  return (
    <CustomFontTooltip
      title="Video Speed. Increase (+ or >), Decrease (- or <)"
      placement="top"
      arrow
    >
      <IconButton
        sx={{
          color: "white",
          fontSize: isScreenSmall ? fontSizeExSmall : fontSizeSmall,
          paddingTop: "0px",
          paddingBottom: "0px",
        }}
        onClick={() => increaseSpeed()}
      >
        <span style={{ display: "flex", alignItems: "center", height: "40px" }}>
          {playbackRate}x
        </span>
      </IconButton>
    </CustomFontTooltip>
  );
};

export const PictureInPictureButton = () => {
  const { isFullscreen, toggleRef, togglePictureInPicture } = useVideoContext();
  return (
    <>
      {!isFullscreen.value && (
        <CustomFontTooltip title="Picture in Picture (P)" placement="top" arrow>
          <IconButton
            sx={{
              color: "white",
            }}
            ref={toggleRef}
            onClick={togglePictureInPicture}
          >
            <PictureInPicture />
          </IconButton>
        </CustomFontTooltip>
      )}
    </>
  );
};

export const ObjectFitButton = () => {
  const { toggleObjectFit } = useVideoContext();
  return (
    <CustomFontTooltip title="Toggle Aspect Ratio (O)" placement="top" arrow>
      <IconButton
        sx={{
          color: "white",
          paddingRight: "0px",
        }}
        onClick={() => toggleObjectFit()}
      >
        <AspectRatioIcon />
      </IconButton>
    </CustomFontTooltip>
  );
};

export const FullscreenButton = () => {
  const { toggleFullscreen } = useVideoContext();
  return (
    <CustomFontTooltip title="Toggle Fullscreen (F)" placement="top" arrow>
      <IconButton
        sx={{
          color: "white",
          paddingRight: "0px",
        }}
        onClick={() => toggleFullscreen()}
      >
        <Fullscreen />
      </IconButton>
    </CustomFontTooltip>
  );
};
