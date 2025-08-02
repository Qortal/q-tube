import React, { useRef, useState, useEffect } from 'react';
import ResponsiveImage from '../../../components/ResponsiveImage.tsx';

export const VideoCardImageContainer = ({
  videoImage,
  frameImages,
  height,
  width,
}) => {
  const [currentImage, setCurrentImage] = useState(videoImage);
  const [nextImage, setNextImage] = useState(null);
  const intervalRef = useRef(null);
  const fadeRef = useRef(null);

  const startPreview = () => {
    let frameIndex = 0;

    intervalRef.current = setInterval(() => {
      const next = frameImages[frameIndex];
      setNextImage(next);

      if (fadeRef.current) {
        fadeRef.current.style.opacity = '1';
      }

      setTimeout(() => {
        setCurrentImage(next);
        if (fadeRef.current) {
          fadeRef.current.style.opacity = '0';
        }
      }, 250); // Match fade duration

      frameIndex = (frameIndex + 1) % frameImages.length;
    }, 500);
  };

  const stopPreview = () => {
    clearInterval(intervalRef.current);
    setNextImage(null);
    setCurrentImage(videoImage);
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      style={{
        height,
        width,
        maxWidth: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      {/* Base image (visible always) */}
      <ResponsiveImage
        src={currentImage}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* Next image fades in on top */}
      <ResponsiveImage
        src={nextImage || undefined}
        width={width}
        height={height}
        ref={fadeRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          transition: 'opacity 0.25s ease-in-out',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
