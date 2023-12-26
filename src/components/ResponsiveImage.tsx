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

  

  return (
    <Box
      sx={{
        padding: '2px',
        height: '100%',
        ...style
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
}

export default ResponsiveImage
