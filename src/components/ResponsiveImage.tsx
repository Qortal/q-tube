import React, { useState, useEffect, CSSProperties } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';
import DeletedVideo from '../assets/img/DeletedVideo.jpg';
import { useIsMobile } from '../hooks/useIsMobile';
interface ResponsiveImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  width,
  height,
  alt,
  className,
  style,
  fill,
}) => {
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);

  const endLoading = (endTimeSeconds: number) => {
    const endTimeMilliSeconds = endTimeSeconds * 1000;
    setTimeout(() => {
      if (loading) setLoading(false);
    }, endTimeMilliSeconds);
  };

  useEffect(() => endLoading(60), [endLoading]);

  return (
    <Box
      sx={{
        padding: isMobile ? '0px' : '5px',
        height: '100%',
        backgroundColor: '#050507',

        ...style,
      }}
      boxShadow={2}
    >
      {loading && (
        <Skeleton
          variant="rectangular"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            visibility: loading ? 'visible' : 'hidden',
            borderRadius: '8px',
          }}
        />
      )}

      <img
        onLoad={() => setLoading(false)}
        src={!src && !loading ? DeletedVideo : src || undefined}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: isMobile ? '0px' : '8px',
          display: loading ? 'none' : 'unset',
          objectFit: fill ? 'fill' : 'contain',
          maskImage: 'radial-gradient(circle, black 95%, transparent 100%)',
          maskMode: 'alpha',
        }}
      />
    </Box>
  );
};

export default ResponsiveImage;
