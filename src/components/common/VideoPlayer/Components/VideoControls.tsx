import {
  Fullscreen,
  MoreVert as MoreIcon,
  Pause,
  PictureInPicture,
  PlayArrow,
  Refresh,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Slider, Typography } from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
import {
  anchorEl,
  canPlay,
  isMobileView,
  isMuted,
  playbackRate,
  playing,
  progress,
  useVideoPlayerState,
  volume,
} from "../VideoPlayer-State.ts";
import { ControlsContainer } from "../VideoPlayer-styles.ts";
import { VideoPlayerProps } from "../VideoPlayer.tsx";
import {
  showControlsFullScreen,
  useVideoControlsState,
} from "./VideoControls-State.ts";

export interface VideoControlProps {
  controlState: ReturnType<typeof useVideoControlsState>;
  videoState: ReturnType<typeof useVideoPlayerState>;
  props: VideoPlayerProps;
  videoRef: any;
}
export const VideoControls = ({
  controlState,
  videoState,
  props,
  videoRef,
}: VideoControlProps) => {
  useSignals();
  const {
    reloadVideo,
    togglePlay,
    onVolumeChange,
    increaseSpeed,
    togglePictureInPicture,
    toggleFullscreen,
    formatTime,
    toggleMute,
  } = controlState;
  const { onProgressChange, handleMenuOpen, handleMenuClose, toggleRef } =
    videoState;
  const { from = null } = props;

  useEffect(() => {
    const videoWidth = videoRef?.current?.offsetWidth;
    if (videoWidth && videoWidth <= 600) {
      isMobileView.value = true;
    }
  }, [canPlay.value]);

  return (
    <ControlsContainer
      style={{ bottom: from === "create" ? "15px" : 0, padding: "0px" }}
      display={showControlsFullScreen.value ? "flex" : "none"}
    >
      {isMobileView.value && canPlay.value && showControlsFullScreen.value ? (
        <>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
            onClick={() => togglePlay()}
          >
            {!playing.value ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginLeft: "15px",
            }}
            onClick={reloadVideo}
          >
            <Refresh />
          </IconButton>
          <Slider
            value={progress.value}
            onChange={onProgressChange}
            min={0}
            max={videoRef.current?.duration || 100}
            sx={{ flexGrow: 1, mx: 2 }}
          />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl.value}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: "250px",
              },
            }}
          >
            <MenuItem>
              <VolumeUp />
              <Slider
                value={volume.value}
                onChange={onVolumeChange}
                min={0}
                max={1}
                step={0.01}
              />
            </MenuItem>
            <MenuItem onClick={() => increaseSpeed()}>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                }}
              >
                Speed: {playbackRate.value}x
              </Typography>
            </MenuItem>
            <MenuItem onClick={togglePictureInPicture}>
              <PictureInPicture />
            </MenuItem>
            <MenuItem onClick={toggleFullscreen}>
              <Fullscreen />
            </MenuItem>
          </Menu>
        </>
      ) : canPlay.value ? (
        <>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
            onClick={() => togglePlay()}
          >
            {!playing.value ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginLeft: "15px",
            }}
            onClick={reloadVideo}
          >
            <Refresh />
          </IconButton>
          <Slider
            value={progress.value}
            onChange={onProgressChange}
            min={0}
            max={videoRef.current?.duration || 100}
            sx={{ flexGrow: 1, mx: 2 }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              marginRight: "5px",
              color: "rgba(255, 255, 255, 0.7)",
              visibility:
                !videoRef.current?.duration || !progress ? "hidden" : "visible",
            }}
          >
            {progress &&
              videoRef.current?.duration &&
              formatTime(progress.value)}
            /
            {progress &&
              videoRef.current?.duration &&
              formatTime(videoRef.current?.duration)}
          </Typography>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginRight: "10px",
            }}
            onClick={toggleMute}
          >
            {isMuted.value ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <Slider
            value={volume.value}
            onChange={onVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              maxWidth: "100px",
            }}
          />
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "14px",
              marginLeft: "5px",
            }}
            onClick={e => increaseSpeed()}
          >
            Speed: {playbackRate}x
          </IconButton>

          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginLeft: "15px",
            }}
            ref={toggleRef}
            onClick={togglePictureInPicture}
          >
            <PictureInPicture />
          </IconButton>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
            onClick={toggleFullscreen}
          >
            <Fullscreen />
          </IconButton>
        </>
      ) : null}
    </ControlsContainer>
  );
};
