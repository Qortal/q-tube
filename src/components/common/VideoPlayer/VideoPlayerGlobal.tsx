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
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Key } from "ts-key-enum";
import { setVideoPlaying } from "../../../state/features/globalSlice.ts";
import { RootState } from "../../../state/store.ts";
import { formatTime } from "../../../utils/numberFunctions.ts";
import { MyContext } from "../../../wrappers/DownloadWrapper.tsx";

const VideoContainer = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
`;

const VideoElement = styled("video")`
  width: 100%;
  height: auto;
  max-height: calc(100vh - 150px);
  background: rgb(33, 33, 33);
`;

const ControlsContainer = styled(Box)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.6);
`;

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  name?: string;
  identifier?: string;
  service?: string;
  autoplay?: boolean;
  from?: string | null;
  customStyle?: any;
  user?: string;
  jsonId?: string;
  element?: null | any;
  checkIfDrag?: () => boolean;
}

export const VideoPlayerGlobal: React.FC<VideoPlayerProps> = ({
  poster,
  name,
  identifier,
  service,
  autoplay = true,
  from = null,
  customStyle = {},
  user = "",
  jsonId = "",
  element,
  checkIfDrag,
}) => {
  const theme = useTheme();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [mutedVolume, setMutedVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [startPlay, setStartPlay] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const reDownload = useRef<boolean>(false);
  const { downloads } = useSelector((state: RootState) => state.global);
  const download = useMemo(() => {
    if (!downloads || !identifier) return {};
    const findDownload = downloads[identifier];

    if (!findDownload) return {};
    return findDownload;
  }, [downloads, identifier]);

  const resourceStatus = useMemo(() => {
    return download?.status || {};
  }, [download]);

  const minSpeed = 0.25;
  const maxSpeed = 4.0;
  const speedChange = 0.25;

  const updatePlaybackRate = (newSpeed: number) => {
    if (videoRef.current) {
      if (newSpeed > maxSpeed || newSpeed < minSpeed) newSpeed = minSpeed;
      videoRef.current.playbackRate = newSpeed;
      setPlaybackRate(newSpeed);
    }
  };

  const increaseSpeed = (wrapOverflow = true) => {
    const changedSpeed = playbackRate + speedChange;
    const newSpeed = wrapOverflow
      ? changedSpeed
      : Math.min(changedSpeed, maxSpeed);

    if (videoRef.current) {
      updatePlaybackRate(newSpeed);
    }
  };

  const decreaseSpeed = () => {
    if (videoRef.current) {
      updatePlaybackRate(playbackRate - speedChange);
    }
  };

  const toggleRef = useRef<any>(null);
  const { downloadVideo } = useContext(MyContext);
  const togglePlay = async () => {
    if (checkIfDrag && checkIfDrag()) return;
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      await videoRef.current.play();
    }
    setPlaying(prev => !prev);
  };

  const onVolumeChange = (_: any, value: number | number[]) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value as number;
    setVolume(value as number);
    setIsMuted(false);
  };

  const onProgressChange = async (_: any, value: number | number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value as number;
    setProgress(value as number);
    if (!playing) {
      await videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  const updateProgress = () => {
    if (!videoRef.current) return;
    setProgress(videoRef.current.currentTime);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    isFullscreen ? exitFullscreen() : enterFullscreen();
  };
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement === videoRef.current) {
      await document.exitPictureInPicture();
    } else {
      await videoRef.current.requestPictureInPicture();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleCanPlay = () => {
    setIsLoading(false);
    setCanPlay(true);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLeavePictureInPicture = async (event: any) => {
      const target = event?.target;
      if (target) {
        target.pause();
        if (setPlaying) {
          setPlaying(false);
        }
      }
    };

    if (videoElement) {
      videoElement.addEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          "leavepictureinpicture",
          handleLeavePictureInPicture
        );
      }
    };
  }, []);

  const reloadVideo = async () => {
    if (!videoRef.current) return;
    const src = videoRef.current.src;
    const currentTime = videoRef.current.currentTime;
    videoRef.current.src = src;
    videoRef.current.load();
    videoRef.current.currentTime = currentTime;
    if (playing) {
      await videoRef.current.play();
    }
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const videoWidth = videoRef?.current?.offsetWidth;
    if (videoWidth && videoWidth <= 600) {
      setIsMobileView(true);
    }
  }, [canPlay]);

  const getDownloadProgress = (current: number, total: number) => {
    const progress = (current / total) * 100;
    return Number.isNaN(progress) ? "" : progress.toFixed(0) + "%";
  };
  const mute = () => {
    setIsMuted(true);
    setMutedVolume(volume);
    setVolume(0);
    if (videoRef.current) videoRef.current.volume = 0;
  };
  const unMute = () => {
    setIsMuted(false);
    setVolume(mutedVolume);
    if (videoRef.current) videoRef.current.volume = mutedVolume;
  };

  const toggleMute = () => {
    isMuted ? unMute() : mute();
  };

  const changeVolume = (volumeChange: number) => {
    if (videoRef.current) {
      const minVolume = 0;
      const maxVolume = 1;

      let newVolume = volumeChange + volume;

      newVolume = Math.max(newVolume, minVolume);
      newVolume = Math.min(newVolume, maxVolume);

      setIsMuted(false);
      setMutedVolume(newVolume);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  const setProgressRelative = (secondsChange: number) => {
    if (videoRef.current) {
      const currentTime = videoRef.current?.currentTime;
      const minTime = 0;
      const maxTime = videoRef.current?.duration || 100;

      let newTime = currentTime + secondsChange;
      newTime = Math.max(newTime, minTime);
      newTime = Math.min(newTime, maxTime);
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const setProgressAbsolute = (videoPercent: number) => {
    if (videoRef.current) {
      videoPercent = Math.min(videoPercent, 100);
      videoPercent = Math.max(videoPercent, 0);
      const finalTime = (videoRef.current?.duration * videoPercent) / 100;
      videoRef.current.currentTime = finalTime;
      setProgress(finalTime);
    }
  };

  const keyboardShortcutsDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (e.key) {
      case Key.Add:
        increaseSpeed(false);
        break;
      case "+":
        increaseSpeed(false);
        break;
      case ">":
        increaseSpeed(false);
        break;

      case Key.Subtract:
        decreaseSpeed();
        break;
      case "-":
        decreaseSpeed();
        break;
      case "<":
        decreaseSpeed();
        break;

      case Key.ArrowLeft:
        {
          if (e.shiftKey) setProgressRelative(-300);
          else if (e.ctrlKey) setProgressRelative(-60);
          else if (e.altKey) setProgressRelative(-10);
          else setProgressRelative(-5);
        }
        break;

      case Key.ArrowRight:
        {
          if (e.shiftKey) setProgressRelative(300);
          else if (e.ctrlKey) setProgressRelative(60);
          else if (e.altKey) setProgressRelative(10);
          else setProgressRelative(5);
        }
        break;

      case Key.ArrowDown:
        changeVolume(-0.05);
        break;
      case Key.ArrowUp:
        changeVolume(0.05);
        break;
    }
  };

  const keyboardShortcutsUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (e.key) {
      case " ":
        togglePlay();
        break;
      case "m":
        toggleMute();
        break;

      case "f":
        enterFullscreen();
        break;
      case Key.Escape:
        exitFullscreen();
        break;

      case "0":
        setProgressAbsolute(0);
        break;
      case "1":
        setProgressAbsolute(10);
        break;
      case "2":
        setProgressAbsolute(20);
        break;
      case "3":
        setProgressAbsolute(30);
        break;
      case "4":
        setProgressAbsolute(40);
        break;
      case "5":
        setProgressAbsolute(50);
        break;
      case "6":
        setProgressAbsolute(60);
        break;
      case "7":
        setProgressAbsolute(70);
        break;
      case "8":
        setProgressAbsolute(80);
        break;
      case "9":
        setProgressAbsolute(90);
        break;
    }
  };

  useEffect(() => {
    if (element) {
      const oldElement = document.getElementById("videoPlayer");
      if (oldElement && oldElement?.parentNode) {
        oldElement?.parentNode.replaceChild(element, oldElement);
        videoRef.current = element;
        setPlaying(true);
        setCanPlay(true);
        setStartPlay(true);
        //videoRef?.current?.addEventListener("click", () => {});
        videoRef?.current?.addEventListener("timeupdate", updateProgress);
        videoRef?.current?.addEventListener("ended", handleEnded);
      }
    }
  }, [element]);

  return (
    <VideoContainer
      tabIndex={0}
      onKeyUp={keyboardShortcutsUp}
      onKeyDown={keyboardShortcutsDown}
      style={{
        padding: from === "create" ? "8px" : 0,
        zIndex: 1000,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <div className="closePlayer">
        <CloseIcon
          onClick={() => {
            dispatch(setVideoPlaying(null));
          }}
          sx={{
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        ></CloseIcon>
      </div>
      <div onClick={togglePlay}>
        <VideoElement id="videoPlayer" />
      </div>
      <ControlsContainer
        style={{
          bottom: from === "create" ? "15px" : 0,
        }}
      >
        {isMobileView && canPlay ? (
          <>
            <IconButton
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
              }}
              onClick={togglePlay}
            >
              {playing ? <Pause /> : <PlayArrow />}
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
              value={progress}
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
              anchorEl={anchorEl}
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
                  value={volume}
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
                  Speed: {playbackRate}x
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
        ) : canPlay ? (
          <>
            <IconButton
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
              }}
              onClick={togglePlay}
            >
              {playing ? <Pause /> : <PlayArrow />}
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
              value={progress}
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
                  !videoRef.current?.duration || !progress
                    ? "hidden"
                    : "visible",
              }}
            >
              {progress && videoRef.current?.duration && formatTime(progress)}/
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
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <Slider
              value={volume}
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
    </VideoContainer>
  );
};
