import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { Key } from "ts-key-enum";
import { setVideoPlaying } from "../../../../state/features/globalSlice.ts";
import {
  setReduxPlaybackRate,
  setStretchVideoSetting,
  setVolumeSetting,
} from "../../../../state/features/persistSlice.ts";
import { RootState, store } from "../../../../state/store.ts";
import { useVideoPlayerState } from "../VideoPlayer-State.ts";
import { VideoPlayerProps } from "../VideoPlayer.tsx";

export const useVideoControlsState = (
  props: VideoPlayerProps,
  videoPlayerState: ReturnType<typeof useVideoPlayerState>
) => {
  useSignals();
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
  } = videoPlayerState;
  const { identifier, autoPlay } = props;

  const showControlsFullScreen = useSignal(true);
  const persistSelector = store.getState().persist;

  const videoPlaying = useSelector(
    (state: RootState) => state.global.videoPlaying
  );

  const minSpeed = 0.25;
  const maxSpeed = 4.0;
  const speedChange = 0.25;

  const updatePlaybackRate = (newSpeed: number) => {
    if (videoRef.current) {
      if (newSpeed > maxSpeed || newSpeed < minSpeed) newSpeed = minSpeed;

      videoRef.current.playbackRate = playbackRate.value;
      playbackRate.value = newSpeed;
      store.dispatch(setReduxPlaybackRate(newSpeed));
    }
  };

  const increaseSpeed = (wrapOverflow = true) => {
    const changedSpeed = playbackRate.value + speedChange;
    const newSpeed = wrapOverflow
      ? changedSpeed
      : Math.min(changedSpeed, maxSpeed);

    if (videoRef.current) {
      updatePlaybackRate(newSpeed);
    }
  };

  const decreaseSpeed = () => {
    if (videoRef.current) {
      updatePlaybackRate(playbackRate.value - speedChange);
    }
  };

  const isFullscreen = useSignal(false);

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
    if (!videoRef.current || !src) return;
    const currentTime = videoRef.current.currentTime;
    videoRef.current.src = src;
    videoRef.current.load();
    videoRef.current.currentTime = currentTime;
    playing.value = true;
    togglePlay();
  };

  const handleCanPlay = () => {
    isLoading.value = false;
    canPlay.value = true;
    updatePlaybackRate(playbackRate.value);
    setPlaying(true); // makes the video play when fully loaded
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
    videoRef.current.volume = newVolume;
    volume.value = newVolume;
    isMuted.value = false;
    store.dispatch(setVolumeSetting(newVolume));
  };

  useEffect(() => {
    if (autoPlay && identifier) togglePlay();
  }, [autoPlay, identifier]);

  const mute = () => {
    isMuted.value = true;
    mutedVolume.value = volume.value;
    volume.value = 0;
    if (videoRef.current) videoRef.current.volume = 0;
  };
  const unMute = () => {
    isMuted.value = false;
    volume.value = mutedVolume.value;
    if (videoRef.current) videoRef.current.volume = mutedVolume.value;
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

      isMuted.value = false;
      mutedVolume.value = newVolume;
      videoRef.current.volume = newVolume;
      volume.value = newVolume;
      store.dispatch(setVolumeSetting(newVolume));
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

  const toggleStretchVideoSetting = () => {
    const newStretchVideoSetting =
      persistSelector.stretchVideoSetting === "contain" ? "fill" : "contain";

    videoObjectFit.value = newStretchVideoSetting;
    store.dispatch(setStretchVideoSetting(newStretchVideoSetting));
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
        store.dispatch(setVideoPlaying(null));
      });
    }
  }, [videoPlaying, identifier, src]);

  return {
    reloadVideo,
    togglePlay,
    onVolumeChange,
    increaseSpeed,
    togglePictureInPicture,
    toggleFullscreen,
    formatTime,
    keyboardShortcutsUp,
    keyboardShortcutsDown,
    handleCanPlay,
    toggleMute,
    showControlsFullScreen,
    setPlaying,
  };
};
