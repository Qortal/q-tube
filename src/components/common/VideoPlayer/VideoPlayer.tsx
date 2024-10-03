import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Box, IconButton, Slider } from "@mui/material";
import { CircularProgress, Typography } from "@mui/material";
import { Key } from "ts-key-enum";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  Fullscreen,
  PictureInPicture,
  VolumeOff,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { MyContext } from "../../../wrappers/DownloadWrapper.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store.ts";
import { Refresh } from "@mui/icons-material";

import { Menu, MenuItem } from "@mui/material";
import { MoreVert as MoreIcon } from "@mui/icons-material";
import { setVideoPlaying } from "../../../state/features/globalSlice.ts";
import {
  ControlsContainer,
  VideoContainer,
  VideoElement,
} from "./VideoPlayer-styles.ts";
import CSS from "csstype";
import {
  setReduxPlaybackRate,
  setStretchVideoSetting,
  setVolumeSetting,
  StretchVideoType,
} from "../../../state/features/persistSlice.ts";

export interface VideoStyles {
  videoContainer?: CSS.Properties;
  video?: CSS.Properties;
  controls?: CSS.Properties;
}
interface VideoPlayerProps {
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

export type refType = {
  getContainerRef: () => React.MutableRefObject<HTMLDivElement>;
  getVideoRef: () => React.MutableRefObject<HTMLVideoElement>;
};
export const VideoPlayer = React.forwardRef<refType, VideoPlayerProps>(
  (
    {
      poster,
      name,
      identifier,
      service,
      autoplay = true,
      from = null,
      videoStyles = {},
      user = "",
      jsonId = "",
      nextVideo,
      onEnd,
      autoPlay,
      style = {},
    }: VideoPlayerProps,
    ref
  ) => {
    const videoSelector = useSelector((state: RootState) => state.video);
    const persistSelector = useSelector((state: RootState) => state.persist);

    const dispatch = useDispatch();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(persistSelector.volume);
    const [mutedVolume, setMutedVolume] = useState(persistSelector.volume);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [canPlay, setCanPlay] = useState(false);
    const [startPlay, setStartPlay] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(
      persistSelector.playbackRate
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [showControlsFullScreen, setShowControlsFullScreen] =
      useState<boolean>(true);
    const [videoObjectFit, setVideoObjectFit] = useState<StretchVideoType>(
      persistSelector.stretchVideoSetting
    );

    const videoPlaying = useSelector(
      (state: RootState) => state.global.videoPlaying
    );
    const { downloads } = useSelector((state: RootState) => state.global);

    const reDownload = useRef<boolean>(false);
    const reDownloadNextVid = useRef<boolean>(false);

    const isFetchingProperties = useRef<boolean>(false);

    const status = useRef<null | string>(null);

    const download = useMemo(() => {
      if (!downloads || !identifier) return {};
      const findDownload = downloads[identifier];

      if (!findDownload) return {};
      return findDownload;
    }, [downloads, identifier]);

    const src = useMemo(() => {
      return download?.url || "";
    }, [download?.url]);
    const resourceStatus = useMemo(() => {
      return download?.status || {};
    }, [download]);

    const minSpeed = 0.25;
    const maxSpeed = 4.0;
    const speedChange = 0.25;

    useImperativeHandle(ref, () => ({
      getVideoRef: () => {
        return videoRef;
      },
      getContainerRef: () => {
        return containerRef;
      },
    }));
    const updatePlaybackRate = (newSpeed: number) => {
      if (videoRef.current) {
        if (newSpeed > maxSpeed || newSpeed < minSpeed) newSpeed = minSpeed;

        videoRef.current.playbackRate = playbackRate;
        setPlaybackRate(newSpeed);
        dispatch(setReduxPlaybackRate(newSpeed));
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

    useEffect(() => {
      reDownload.current = false;
      reDownloadNextVid.current = false;
      setIsLoading(false);
      setCanPlay(false);
      setProgress(0);
      setPlaying(false);
      setStartPlay(false);
      isFetchingProperties.current = false;
      status.current = null;
    }, [identifier]);

    useEffect(() => {
      if (autoPlay && identifier) {
        setStartPlay(true);
        setPlaying(true);
        togglePlay(true);
      }
    }, [autoPlay, startPlay, identifier]);

    const refetch = React.useCallback(async () => {
      if (!name || !identifier || !service || isFetchingProperties.current)
        return;
      try {
        isFetchingProperties.current = true;
        await qortalRequest({
          action: "GET_QDN_RESOURCE_PROPERTIES",
          name,
          service,
          identifier,
        });
      } catch (error) {
        console.log(error);
      } finally {
        isFetchingProperties.current = false;
      }
    }, [identifier, name, service]);

    const toggleRef = useRef<any>(null);
    const { downloadVideo } = useContext(MyContext);

    const togglePlay = async (isPlay?: boolean) => {
      if (!videoRef.current) return;

      setStartPlay(true);
      if (!src || resourceStatus?.status !== "READY") {
        const el = document.getElementById("videoWrapper");
        if (el) {
          el?.parentElement?.removeChild(el);
        }
        ReactDOM.flushSync(() => {
          setIsLoading(true);
        });
        getSrc();
      }

      if (isPlay) setPlaying(true);
      else setPlaying(prevState => !prevState);

      if (playing && !isPlay) videoRef.current.pause();
      else await videoRef.current.play();
    };

    const onVolumeChange = (_: any, value: number | number[]) => {
      if (!videoRef.current) return;
      const newVolume = value as number;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(false);
      dispatch(setVolumeSetting(newVolume));
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
      if (onEnd) {
        onEnd();
      }
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
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    useEffect(() => {
      videoRef.current.volume = volume;
      if (
        videoPlaying &&
        videoPlaying.id === identifier &&
        src &&
        videoRef?.current
      ) {
        handleCanPlay();

        videoRef.current.currentTime = videoPlaying.currentTime;
        videoRef.current.play().then(() => {
          setPlaying(true);
          setStartPlay(true);
          dispatch(setVideoPlaying(null));
        });
      }
    }, [videoPlaying, identifier, src]);

    const handleCanPlay = () => {
      setIsLoading(false);
      setCanPlay(true);
      updatePlaybackRate(playbackRate);
    };

    const getSrc = React.useCallback(async () => {
      if (!name || !identifier || !service || !jsonId || !user) return;
      try {
        downloadVideo({
          name,
          service,
          identifier,
          properties: {
            jsonId,
            user,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }, [identifier, name, service, jsonId, user]);

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

    useEffect(() => {
      const videoElement = videoRef.current;

      const minimizeVideo = async () => {
        if (!videoElement) return;

        dispatch(setVideoPlaying(videoElement));
        // const handleClose = () => {
        //   if (videoElement && videoElement.parentElement) {
        //     const el = document.getElementById('videoWrapper')
        //     if (el) {
        //       el?.parentElement?.removeChild(el)
        //     }
        //   }
        // }
        // const createCloseButton = (): HTMLButtonElement => {
        //   const closeButton = document.createElement('button')
        //   closeButton.textContent = 'X'
        //   closeButton.style.position = 'absolute'
        //   closeButton.style.top = '0'
        //   closeButton.style.right = '0'
        //   closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
        //   closeButton.style.border = 'none'
        //   closeButton.style.fontWeight = 'bold'
        //   closeButton.style.fontSize = '1.2rem'
        //   closeButton.style.cursor = 'pointer'
        //   closeButton.style.padding = '2px 8px'
        //   closeButton.style.borderRadius = '0 0 0 4px'

        //   closeButton.addEventListener('click', handleClose)

        //   return closeButton
        // }
        // const buttonClose = createCloseButton()
        // const videoWrapper = document.createElement('div')
        // videoWrapper.id = 'videoWrapper'
        // videoWrapper.style.position = 'fixed'
        // videoWrapper.style.zIndex = '900000009'
        // videoWrapper.style.bottom = '0px'
        // videoWrapper.style.right = '0px'

        // videoElement.parentElement?.insertBefore(videoWrapper, videoElement)
        // videoWrapper.appendChild(videoElement)

        // videoWrapper.appendChild(buttonClose)
        // videoElement.controls = true
        // videoElement.style.height = 'auto'
        // videoElement.style.width = '300px'

        // document.body.appendChild(videoWrapper)
      };

      return () => {
        if (videoElement) {
          if (videoElement && !videoElement.paused && !videoElement.ended) {
            minimizeVideo();
          }
        }
      };
    }, []);

    function formatTime(seconds: number): string {
      seconds = Math.floor(seconds);
      const minutes: number | string = Math.floor(seconds / 60);
      let hours: number | string = Math.floor(minutes / 60);

      let remainingSeconds: number | string = seconds % 60;
      let remainingMinutes: number | string = minutes % 60;

      if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
      }

      if (remainingMinutes < 10) {
        remainingMinutes = "0" + remainingMinutes;
      }

      if (hours === 0) {
        hours = "";
      } else {
        hours = hours + ":";
      }

      return hours + remainingMinutes + ":" + remainingSeconds;
    }

    const reloadVideo = async () => {
      if (!videoRef.current) return;
      const currentTime = videoRef.current.currentTime;
      videoRef.current.src = src;
      videoRef.current.load();
      videoRef.current.currentTime = currentTime;
      if (playing) await videoRef.current.play();
      setPlaying(true);
    };

    const refetchInInterval = () => {
      try {
        const interval = setInterval(() => {
          if (status?.current === "DOWNLOADED") refetch();
          if (status?.current === "READY") clearInterval(interval);
        }, 7500);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      if (resourceStatus?.status) {
        status.current = resourceStatus?.status;
      }
      if (
        resourceStatus?.status === "DOWNLOADED" &&
        reDownload?.current === false
      ) {
        refetchInInterval();
        reDownload.current = true;
      }
    }, [getSrc, resourceStatus]);

    useEffect(() => {
      if (resourceStatus?.status) {
        status.current = resourceStatus?.status;
      }
      if (
        resourceStatus?.status === "READY" &&
        reDownloadNextVid?.current === false
      ) {
        if (nextVideo) {
          downloadVideo({
            name: nextVideo?.name,
            service: nextVideo?.service,
            identifier: nextVideo?.identifier,
            properties: {
              jsonId: nextVideo?.jsonId,
              user,
            },
          });
        }
        reDownloadNextVid.current = true;
      }
    }, [getSrc, resourceStatus]);

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
        dispatch(setVolumeSetting(newVolume));
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

    const toggleStretchVideoSetting = () => {
      const newStretchVideoSetting =
        persistSelector.stretchVideoSetting === "contain" ? "fill" : "contain";

      setVideoObjectFit(newStretchVideoSetting);
      dispatch(setStretchVideoSetting(newStretchVideoSetting));
    };
    const keyboardShortcutsDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      switch (e.key) {
        case "o":
          toggleStretchVideoSetting();
          break;

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

    return (
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
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={resourceStatus?.status === "READY" ? "55px " : 0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={25}
            bgcolor="rgba(0, 0, 0, 0.6)"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              height: "100%",
            }}
          >
            <CircularProgress color="secondary" />
            {resourceStatus && (
              <Typography
                variant="subtitle2"
                component="div"
                sx={{
                  color: "white",
                  fontSize: "15px",
                  textAlign: "center",
                }}
              >
                {resourceStatus?.status === "NOT_PUBLISHED" && (
                  <>
                    Video file was not published. Please inform the publisher!
                  </>
                )}
                {resourceStatus?.status === "REFETCHING" ? (
                  <>
                    <>
                      {getDownloadProgress(
                        resourceStatus?.localChunkCount,
                        resourceStatus?.totalChunkCount
                      )}
                    </>

                    <> Refetching in 25 seconds</>
                  </>
                ) : resourceStatus?.status === "DOWNLOADED" ? (
                  <>Download Completed: building video...</>
                ) : resourceStatus?.status !== "READY" ? (
                  <>
                    {getDownloadProgress(
                      resourceStatus?.localChunkCount,
                      resourceStatus?.totalChunkCount
                    )}
                  </>
                ) : (
                  <>Fetching video...</>
                )}
              </Typography>
            )}
          </Box>
        )}
        {((!src && !isLoading) || !startPlay) && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={500}
            bgcolor="rgba(0, 0, 0, 0.6)"
            onClick={() => {
              if (from === "create") return;
              dispatch(setVideoPlaying(null));
              togglePlay();
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            <PlayArrow
              sx={{
                width: "50px",
                height: "50px",
                color: "white",
              }}
            />
          </Box>
        )}

        <VideoElement
          id={identifier}
          ref={videoRef}
          src={!startPlay ? "" : resourceStatus?.status === "READY" ? src : ""}
          poster={!startPlay ? poster : ""}
          onTimeUpdate={updateProgress}
          autoPlay={autoplay}
          onClick={() => togglePlay()}
          onEnded={handleEnded}
          // onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onMouseEnter={e => {
            setShowControlsFullScreen(true);
          }}
          onMouseLeave={e => {
            setShowControlsFullScreen(false);
          }}
          preload="metadata"
          style={
            startPlay
              ? {
                  ...videoStyles?.video,
                  objectFit: videoObjectFit,
                }
              : { height: "100%", ...videoStyles }
          }
        />

        <ControlsContainer
          style={{ bottom: from === "create" ? "15px" : 0, padding: "0px" }}
          display={showControlsFullScreen ? "flex" : "none"}
        >
          {isMobileView && canPlay && showControlsFullScreen ? (
            <>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                }}
                onClick={() => togglePlay()}
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
                onClick={() => togglePlay()}
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
                {progress && videoRef.current?.duration && formatTime(progress)}
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
  }
);
