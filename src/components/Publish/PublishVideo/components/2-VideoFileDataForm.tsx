import { Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { FrameExtractor } from '../../../common/FrameExtractor/FrameExtractor.tsx';
import { usePublishVideo } from '../PublishVideoContext.tsx';
import {
  VideoCategorySelection,
  VideoCoverImage,
  VideoCoverImageForAll,
  VideoDescriptionEditor,
  VideoDurationDisplay,
  VideoFilenameDisplay,
  VideoTitleInput,
} from './VideoFormElements.tsx';

export const VideoFileDataForm: React.FC = () => {
  const workflow = usePublishVideo();
  const [videoLoadStartTime, setVideoLoadStartTime] = useState<number[]>([]);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(-1);
  const currentProcessingIndexRef = useRef(currentProcessingIndex);
  const pollingActiveRef = useRef(false);

  const {
    files,
    videoDurations,
    videoFramesExtracted,
    autoRefreshDuration,
    setVideoDurations,
    setVideoFramesExtracted,
    setAutoRefreshDuration,
    assembleVideoDurations,
    onFramesExtracted,
    setFiles,
    handleOnchange,
    isCheckSameCoverImage,
    imageExtracts,
    videoProcessingProgress,
    framesExtractedCount,
    setVideoProcessingProgress,
    setFramesExtractedCount,
  } = workflow;
  
  // Keep refs updated
  useEffect(() => {
    currentProcessingIndexRef.current = currentProcessingIndex;
  }, [currentProcessingIndex]);

  // Initialize load start times and videoFramesExtracted when files change, reset when files are cleared
  useEffect(() => {
    if (files.length > 0) {
      setVideoLoadStartTime(new Array(files.length).fill(Date.now()));
      // Initialize videoFramesExtracted array if it doesn't match the files length
      if (videoFramesExtracted.length !== files.length) {
        setVideoFramesExtracted(new Array(files.length).fill(false));
      }
      // Initialize framesExtractedCount array if it doesn't match the files length
      if (framesExtractedCount.length !== files.length) {
        setFramesExtractedCount(new Array(files.length).fill(0));
      }
    } else {
      // Reset local state when files are cleared
      setCurrentProcessingIndex(-1);
      setVideoLoadStartTime([]);
      pollingActiveRef.current = false;
      setVideoProcessingProgress(0);
      setFramesExtractedCount([]);
    }
  }, [files.length, videoFramesExtracted.length, framesExtractedCount.length, setVideoFramesExtracted, setVideoProcessingProgress, setFramesExtractedCount]);

  // Call assembleVideoDurations in useEffect to avoid state update during render
  useEffect(() => {
    assembleVideoDurations();
  }, [files.length, videoDurations.length, assembleVideoDurations]);

  // Start processing when files are added
  useEffect(() => {
    if (files.length > 0 && currentProcessingIndex === -1) {
      setCurrentProcessingIndex(0);
    }
  }, [files.length]);

  // Move to next video when current one finishes frame extraction
  useEffect(() => {
    if (currentProcessingIndex >= 0 && currentProcessingIndex < files.length) {
      const hasFrames = videoFramesExtracted[currentProcessingIndex];
      if (hasFrames) {
        // Move to next video
        const nextIndex = currentProcessingIndex + 1;
        if (nextIndex < files.length) {
          // Add a small delay to give the video element time to properly load and render
          setTimeout(() => {
            // Reset load start time for the next video
            setVideoLoadStartTime(prev => {
              const newTimes = [...prev];
              newTimes[nextIndex] = Date.now();
              return newTimes;
            });
            setCurrentProcessingIndex(nextIndex);
          }, 500); // 500ms delay
        } else {
          // All videos processed
          setCurrentProcessingIndex(-1);
          // Don't stop polling here - let the polling effect handle it
        }
      }
    }
  }, [currentProcessingIndex, videoFramesExtracted, files.length]);

  // Polling-based auto-refresh for stuck videos only
  useEffect(() => {
    if (!autoRefreshDuration || files.length === 0 || pollingActiveRef.current) {
      return;
    }

    pollingActiveRef.current = true;

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      
      // Only check if we have a current video to process
      if (currentProcessingIndexRef.current === -1) {
        // All videos processed, stop polling
        clearInterval(intervalId);
        pollingActiveRef.current = false;
        setAutoRefreshDuration(false);
        return;
      }
      
      const index = currentProcessingIndexRef.current;
      
      // Only check the current video being processed
      const hasDuration = videoDurations[index] > 0;
      const hasFramesExtracted = videoFramesExtracted[index];
      const loadStartTime = videoLoadStartTime[index] || currentTime;
      const timeSinceLoadStart = currentTime - loadStartTime;
      
      // Check if current video is stuck (no duration OR no frames)
      if (!hasDuration || !hasFramesExtracted) {
        // Only refresh if it's been stuck for more than 10 seconds
        if (timeSinceLoadStart > 10000) {
          // Force video to reload by calling video.load() directly
          const videoElement = document.querySelector(`video[data-video-index="${index}"]`) as HTMLVideoElement;
          if (videoElement) {
            videoElement.load();
          }
          
          // Reset the load start time for this video
          setVideoLoadStartTime(prev => {
            const newTimes = [...prev];
            newTimes[index] = currentTime;
            return newTimes;
          });
        }
      }
    }, 5000); // Check every 5 seconds

    // Cleanup interval when component unmounts
    return () => {
      clearInterval(intervalId);
      pollingActiveRef.current = false;
    };
  }, [autoRefreshDuration, files.length]); // Only depend on autoRefreshDuration and files.length

  // Reset auto-refresh when files are removed
  useEffect(() => {
    if (files.length === 0 && autoRefreshDuration) {
      setAutoRefreshDuration(false);
    }
  }, [files.length, autoRefreshDuration, setAutoRefreshDuration]);

  // Calculate overall video processing progress
  useEffect(() => {
    if (files.length === 0) {
      setVideoProcessingProgress(0);
      return;
    }

    // Total points = files.length * 5 (4 frames + 1 duration per video)
    const totalPoints = files.length * 5;
    
    // Calculate completed points
    let completedPoints = 0;
    
    for (let i = 0; i < files.length; i++) {
      // Count frames extracted (non-empty strings in imageExtracts)
      const extracts = imageExtracts[i] || [];
      const nonEmptyExtracts = extracts.filter((extract: string) => extract && extract.length > 0);
      completedPoints += nonEmptyExtracts.length;
      
      // Add 1 point for duration if it's defined and greater than 0
      if (videoDurations[i] > 0) {
        completedPoints += 1;
      }
    }
    
    // Calculate percentage and truncate to nearest whole number
    const progressPercentage = Math.floor((completedPoints / totalPoints) * 100);
    setVideoProcessingProgress(progressPercentage);
  }, [files.length, imageExtracts, videoDurations, setVideoProcessingProgress]);

  return (
    <>
      {files?.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <VideoCategorySelection />
          </Box>
          
          {isCheckSameCoverImage && <VideoCoverImageForAll />}
          
          {files.map((file, index) => (
            <React.Fragment key={index}>
              <FrameExtractor
                key={`video-${index}`}
                videoFile={file.file || undefined}
                onFramesExtracted={async (imgs) => {
                  await onFramesExtracted(imgs, index);
                }}
                onFrameProgress={(frameIndex, frameCount) => {
                  setFramesExtractedCount(prev => {
                    const newCounts = [...prev];
                    newCounts[frameIndex] = frameCount;
                    return newCounts;
                  });
                }}
                videoDurations={videoDurations}
                setVideoDurations={setVideoDurations}
                index={index}
                shouldProcess={currentProcessingIndex === index}
              />
              
              {!isCheckSameCoverImage && (
                <VideoCoverImage
                  coverImage={file?.coverImage || ''}
                  onCoverImageChange={(img: string) =>
                    handleOnchange(index, 'coverImage', img, setFiles)
                  }
                />
              )}

              <VideoTitleInput
                value={file.title || ''}
                onChange={(value: string) =>
                  handleOnchange(index, 'title', value, setFiles)
                }
              />
              
              <VideoFilenameDisplay filename={file?.file?.name || ''} />
              
              <VideoDurationDisplay
                duration={videoDurations[index] || 0}
              />
              
              <VideoDescriptionEditor
                value={file?.description || ''}
                onChange={(value: string) =>
                  handleOnchange(index, 'description', value, setFiles)
                }
              />
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};