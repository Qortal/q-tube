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
}

export const FrameExtractor = ({
  videoFile,
  fileReference,
  onFramesExtracted,
  videoDurations,
  index,
  setVideoDurations,
}: FrameExtractorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [durations, setDurations] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isReady, percentLoaded, status } = useResourceStatus({
    resource: fileReference || null,
    retryAttempts: 200,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoFile, fileReference]);
  useEffect(() => {
    if (durations.length === 4) {
      extractFrames();
    }
  }, [durations]);

  const videoSrc = useMemo(() => {
    if (videoFile) {
      return URL.createObjectURL(videoFile);
    } else if (fileReference && status === 'READY') {
      return qortalGetMetadataToString(fileReference);
    }
    return undefined;
  }, [videoFile, fileReference, status]);

  useEffect(() => {
    return () => {
      if (videoFile && videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc, videoFile]);

  const extractFrames = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const MAX_WIDTH = 800;
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameData: Blob[] = [];

    for (const time of durations) {
      await new Promise<void>((resolve) => {
        video.currentTime = time;
        const onSeeked = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              frameData.push(blob);
            }
            resolve();
          }, 'image/png');
          video.removeEventListener('seeked', onSeeked);
        };
        video.addEventListener('seeked', onSeeked, { once: true });
      });
    }

    await onFramesExtracted(frameData);
  };
  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} src={videoSrc}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};
