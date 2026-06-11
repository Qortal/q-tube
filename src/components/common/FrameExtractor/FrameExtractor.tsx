import { QortalGetMetadata, useResourceStatus } from 'qapp-core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { qortalGetMetadataToString } from '../../../utils/stringFunctions.ts';

export interface FrameExtractorProps {
  videoFile?: File;
  fileReference?: QortalGetMetadata;
  onFramesExtracted: (imgs, index?: number) => Promise<void>;
  videoDurations: number[];
  index: number;
  setVideoDurations: (durations: number[]) => void;
  shouldProcess: boolean;
}

export const FrameExtractor = ({
  videoFile,
  fileReference,
  onFramesExtracted,
  videoDurations,
  index,
  setVideoDurations,
  shouldProcess,
}: FrameExtractorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [durations, setDurations] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasProcessedRef = useRef<boolean>(false);
  const videoSrcRef = useRef<string | undefined>(undefined);

  const { isReady, percentLoaded, status } = useResourceStatus({
    resource: fileReference || null,
    retryAttempts: 200,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldProcess) return;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      if (isFinite(duration)) {
        const newVideoDurations = [...videoDurations];
        newVideoDurations[index] = duration;
        setVideoDurations(newVideoDurations);

        const section = duration / 4;
        const timestamps: number[] = [];

        for (let i = 0; i < 4; i++) {
          const randomTime = Math.random() * section + i * section;
          timestamps.push(randomTime);
        }

        setDurations(timestamps);
      } else {
        onFramesExtracted([]);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Force the video to load if it has a source
    if (video.src && video.readyState === 0) {
      video.load();
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoFile, fileReference, videoDurations, index, shouldProcess, setVideoDurations]);
  useEffect(() => {
    if (durations.length === 4 && shouldProcess) {
      // Delay to ensure video is ready for frame extraction
      // Give the video element time to render and provide dimensions
      setTimeout(() => {
        extractFrames();
      }, 500);
    }
  }, [durations, shouldProcess]);

  const videoSrc = useMemo(() => {
    // Revoke previous blob URL if it exists
    if (videoSrcRef.current && videoSrcRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(videoSrcRef.current);
    }
    
    if (videoFile) {
      const src = URL.createObjectURL(videoFile);
      videoSrcRef.current = src;
      return src;
    } else if (fileReference && status === 'READY') {
      const src = qortalGetMetadataToString(fileReference);
      videoSrcRef.current = src;
      return src;
    } else {
      videoSrcRef.current = undefined;
      return undefined;
    }
  }, [videoFile, fileReference, status]);

  useEffect(() => {
    return () => {
      // Revoke blob URL when component unmounts
      if (videoSrcRef.current && videoSrcRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrcRef.current);
        videoSrcRef.current = undefined;
      }
    };
  }, []); // Empty dependency array - only run on unmount

  const extractFrames = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    // Ensure video has a source
    if (!video.src) {
      return;
    }

    // Check if video is in the DOM
    if (!document.body.contains(video)) {
      return;
    }

    // Set video to muted to prevent autoplay policies from blocking
    video.muted = true;

    // Make video visible temporarily to ensure it renders
    const originalDisplay = video.style.display;
    const originalVisibility = video.style.visibility;
    const originalOpacity = video.style.opacity;
    
    video.style.display = 'block';
    video.style.visibility = 'visible';
    video.style.opacity = '0.01'; // Nearly invisible but still renders

    // Set canvas size first (this might help force rendering)
    const MAX_WIDTH = 800;
    const scale = Math.min(1, MAX_WIDTH / (video.videoWidth || 1920)); // Use default if not available yet
    canvas.width = (video.videoWidth || 1920) * scale;
    canvas.height = (video.videoHeight || 1080) * scale;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const frameData: Blob[] = [];

    for (let i = 0; i < durations.length; i++) {
      const time = durations[i];
      
      await new Promise<void>((resolve) => {
        video.currentTime = time;
        const onSeeked = () => {
          try {
            // Update canvas size if video dimensions are now available
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              const newScale = Math.min(1, MAX_WIDTH / video.videoWidth);
              canvas.width = video.videoWidth * newScale;
              canvas.height = video.videoHeight * newScale;
            }
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (blob) {
                frameData.push(blob);
              }
              resolve();
            }, 'image/png');
          } catch (error) {
            resolve();
          }
          video.removeEventListener('seeked', onSeeked);
        };
        video.addEventListener('seeked', onSeeked, { once: true });
      });
    }

    // Restore original styles
    video.style.display = originalDisplay;
    video.style.visibility = originalVisibility;
    video.style.opacity = originalOpacity;

    await onFramesExtracted(frameData);
  };
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', visibility: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ width: 0, height: 0, visibility: 'hidden' }}
        src={videoSrc}
        data-video-index={index}
      ></video>
      <canvas ref={canvasRef} style={{ width: 0, height: 0, visibility: 'hidden' }}></canvas>
    </div>
  );
};
