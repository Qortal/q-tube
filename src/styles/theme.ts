import { createTheme } from '@mui/material/styles';

const commonThemeOptions = {
  typography: {
    fontFamily: ['Inter'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },

    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.2px',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },
};

const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(63, 81, 181)',
      dark: 'rgb(113, 198, 212)',
      light: 'rgb(180, 200, 235)',
    },
    secondary: {
      main: 'rgba(194, 222, 236, 1)',
    },
    background: {
      default: 'rgba(250, 250, 250, 1)',
      paper: 'rgb(220, 220, 220)', // darker card background
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // 87% black (slightly softened)
      secondary: 'rgba(0, 0, 0, 0.6)', // 60% black
    },
  },
});

const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(100, 155, 240)',
      dark: 'rgb(45, 92, 201)',
      light: 'rgb(130, 185, 255)',
    },
    secondary: {
      main: 'rgb(69, 173, 255)',
    },
    background: {
      default: 'rgb(49, 51, 56)',
      paper: 'rgb(62, 64, 68)',
    },
    text: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(179, 179, 179)',
    },
  },
});

export { lightTheme, darkTheme };
