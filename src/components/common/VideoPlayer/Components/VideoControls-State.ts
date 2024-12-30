import { useSignal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Key } from "ts-key-enum";
import { setVideoPlaying } from "../../../../state/features/globalSlice.ts";
import { RootState } from "../../../../state/store.ts";
import { useVideoPlayerState } from "../VideoPlayer-State.ts";
import { VideoPlayerProps } from "../VideoPlayer.tsx";

export const useVideoControlsState = (
  props: VideoPlayerProps,
  videoPlayerState: ReturnType<typeof useVideoPlayerState>
) => {
  const {
    src,
    getSrc,
    resourceStatus,
    videoRef,
    playbackRate,
    playing,
    isLoading,
    startPlay,
    volume,
    isMuted,
    mutedVolume,
    progress,
    videoObjectFit,
    canPlay,
    containerRef,
  } = videoPlayerState;
  const { identifier, autoPlay } = props;

  const showControlsFullScreen = useSignal(true);
  const dispatch = useDispatch();
  const persistSelector = useSelector((root: RootState) => root.persist);

  const videoPlaying = useSelector(
    (state: RootState) => state.global.videoPlaying
  );

  const minSpeed = 0.25;
  const maxSpeed = 4.0;
  const speedChange = 0.25;

  const updatePlaybackRate = (newSpeed: number) => {
    if (videoRef.current) {
      if (newSpeed > maxSpeed || newSpeed < minSpeed) newSpeed = minSpeed;

      videoRef.current.playbackRate = newSpeed;
      playbackRate.value = newSpeed;
    }
  };

  const increaseSpeed = (wrapOverflow = true) => {
    const changedSpeed = playbackRate.value + speedChange;
    const newSpeed = wrapOverflow
      ? changedSpeed
      : Math.min(changedSpeed, maxSpeed);

    updatePlaybackRate(newSpeed);
  };

  const decreaseSpeed = () => {
    updatePlaybackRate(playbackRate.value - speedChange);
  };

  const isFullscreen = useSignal(false);

  const enterFullscreen = () => {
    if (!containerRef.current) return;

    if (containerRef.current.requestFullscreen && !isFullscreen.value) {
      containerRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (isFullscreen.value) document.exitFullscreen();
  };

  const toggleFullscreen = () => {
    isFullscreen.value ? exitFullscreen() : enterFullscreen();
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
      isFullscreen.value = !!document.fullscreenElement;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const reloadVideo = async () => {
    if (!videoRef.current || !src) return;
    const currentTime = videoRef.current.currentTime;
    videoRef.current.src = src;
    videoRef.current.load();
    videoRef.current.currentTime = currentTime;
    playing.value = true;
    togglePlay();
  };

  const firstPlay = useSignal(true);
  const handleCanPlay = () => {
    if (firstPlay.value) setPlaying(true); // makes the video play when fully loaded
    firstPlay.value = false;
    isLoading.value = false;
    updatePlaybackRate(persistSelector.playbackRate);
  };

  const setPlaying = async (setPlay: boolean) => {
    setPlay ? await videoRef.current.play() : videoRef.current.pause();
    playing.value = setPlay;
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    if (!src || resourceStatus?.status !== "READY") {
      const el = document.getElementById("videoWrapper");
      if (el) {
        el?.parentElement?.removeChild(el);
      }
      ReactDOM.flushSync(() => {
        isLoading.value = true;
      });
      getSrc();
    }

    startPlay.value = true;
    setPlaying(!playing.value);
  };

  const onVolumeChange = (_: any, value: number | number[]) => {
    if (!videoRef.current) return;
    const newVolume = value as number;
    isMuted.value = false;
    mutedVolume.value = newVolume;
    volume.value = newVolume;
  };

  useEffect(() => {
    if (autoPlay && identifier) togglePlay();
  }, [autoPlay, identifier]);

  const mute = () => {
    isMuted.value = true;
    mutedVolume.value = volume.value;
    volume.value = 0;
  };
  const unMute = () => {
    isMuted.value = false;
    volume.value = mutedVolume.value;
  };

  const toggleMute = () => {
    isMuted.value ? unMute() : mute();
  };

  const changeVolume = (volumeChange: number) => {
    if (videoRef.current) {
      const minVolume = 0;
      const maxVolume = 1;

      let newVolume = volumeChange + volume.value;

      newVolume = Math.max(newVolume, minVolume);
      newVolume = Math.min(newVolume, maxVolume);
      newVolume = +newVolume.toFixed(2);
      isMuted.value = false;
      mutedVolume.value = newVolume;
      volume.value = newVolume;
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
      progress.value = newTime;
    }
  };

  const setProgressAbsolute = (videoPercent: number) => {
    if (videoRef.current) {
      videoPercent = Math.min(videoPercent, 100);
      videoPercent = Math.max(videoPercent, 0);
      const finalTime = (videoRef.current?.duration * videoPercent) / 100;
      videoRef.current.currentTime = finalTime;
      progress.value = finalTime;
    }
  };

  const setStretchVideoSetting = (value: "contain" | "fill") => {
    videoObjectFit.value = value;
  };

  const toggleStretchVideoSetting = () => {
    videoObjectFit.value =
      videoObjectFit.value === "contain" ? "fill" : "contain";
  };

  const keyboardShortcuts = (
    e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    // console.log("hotkey is: ", '"' + e.key + '"');

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
      case " ":
        togglePlay();
        break;
      case "m":
        toggleMute();
        break;

      case "f":
        toggleFullscreen();
        break;
      case Key.Escape:
        exitFullscreen();
        break;

      case "r":
        reloadVideo();
        break;

      case "p":
        togglePictureInPicture();
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
    videoRef.current.volume = volume.value;
    if (
      videoPlaying &&
      videoPlaying.id === identifier &&
      src &&
      videoRef?.current
    ) {
      handleCanPlay();

      videoRef.current.currentTime = videoPlaying.currentTime;
      videoRef.current.play().then(() => {
        playing.value = true;
        startPlay.value = true;
        dispatch(setVideoPlaying(null));
      });
    }
  }, [videoPlaying, identifier, src]);

  useSignalEffect(() => {
    console.log("canPlay is: ", canPlay.value); // makes the function execute when canPlay changes
  });

  return {
    reloadVideo,
    togglePlay,
    onVolumeChange,
    increaseSpeed,
    togglePictureInPicture,
    toggleFullscreen,
    keyboardShortcuts,
    handleCanPlay,
    toggleMute,
    showControlsFullScreen,
    setPlaying,
    isFullscreen,
    setStretchVideoSetting,
  };
};
