import React, { useState, useEffect, CSSProperties } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { Box } from '@mui/material'

interface ResponsiveImageProps {
  src: string
  width: number
  height: number
  alt?: string
  className?: string
  style?: CSSProperties
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  width,
  height,
  alt,
  className,
  style
}) => {
  const [loading, setLoading] = useState(true)

  

  const aspectRatio = (height / width) * 100



  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    paddingBottom: `${aspectRatio}%`,
    overflow: 'hidden',
    ...style
  }

  return (
    <Box
      sx={{
        padding: '2px',
        height: '100%'
      }}
    >
   
      {loading && (
        <Skeleton
          variant="rectangular"
          style={{
            width: '100%',
            height: 0,
            paddingBottom: `${(height / width) * 100}%`,
            objectFit: 'contain',
            visibility: loading ? 'visible' : 'hidden',
            borderRadius: '8px'
          }}
        />
      )}

      <img
        onLoad={() => setLoading(false)}
        src={src}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          visibility: loading ? 'hidden' : 'visible',
          position: loading ? 'absolute' : 'unset',
          objectFit: 'contain'
        }}
      />
    </Box>
  )

  return (
    <div style={wrapperStyle} className={className}>
      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          style={{
            ...imageStyle,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      )}
    </div>
  )
}

export default ResponsiveImage
