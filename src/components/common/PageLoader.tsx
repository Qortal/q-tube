import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/system/Box';
import { useTheme } from '@mui/material';

interface PageLoaderProps {
  size?: number;
  thickness?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  size = 40,
  thickness = 5,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        // backgroundColor: 'rgba(255, 255, 255, 0.25)',
        zIndex: 1000,
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{
          color: theme.palette.secondary.main,
        }}
      />
    </Box>
  );
};

export default PageLoader;
