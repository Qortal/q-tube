import { useEffect, useRef, useState, useMemo } from 'react';

export interface FrameExtractorProps {
  videoFile: File;
  onFramesExtracted: (imgs, index?: number) => Promise<void>;
  videoDurations: number[];
  index: number;
  setVideoDurations: (durations: number[]) => void;
}

export const FrameExtractor = ({
  videoFile,
  onFramesExtracted,
  videoDurations,
  index,
  setVideoDurations,
}: FrameExtractorProps) => {
  const videoRef = useRef(null);
  const [durations, setDurations] = useState([]);
  const canvasRef = useRef(null);

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
        const timestamps = [];

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
  }, [videoFile]);
  useEffect(() => {
    if (durations.length === 4) {
      extractFrames();
    }
  }, [durations]);

  const fileUrl = useMemo(() => {
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

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

    const frameData = [];

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
      <video ref={videoRef} style={{ display: 'none' }} src={fileUrl}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};
