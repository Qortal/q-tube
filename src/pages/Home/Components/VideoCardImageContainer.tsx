import React, { useState } from "react";
import ResponsiveImage from "../../../components/ResponsiveImage.tsx";

export const VideoCardImageContainer = ({
  videoImage,
  frameImages,
  height,
  width,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const intervalRef = React.useRef(null);

  const startPreview = () => {
    let frameIndex = 0;
    intervalRef.current = setInterval(() => {
      setPreviewImage(frameImages[frameIndex]);
      frameIndex = (frameIndex + 1) % frameImages.length;
    }, 500); // Change frame every 500 ms
  };

  const stopPreview = () => {
    clearInterval(intervalRef.current);
    setPreviewImage(null);
  };

  return (
    <div
      style={{
        height,
        maxWidth: "100%",
      }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <ResponsiveImage
        src={previewImage || videoImage}
        width={266}
        height={150}
      />
    </div>
  );
};
