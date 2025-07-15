import { alpha, createTheme } from '@mui/material/styles';

const commonThemeOptions = {
  typography: {
    fontFamily: ['Roboto'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700, // changed from 600 to match Roboto weights
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.2,
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
      // main: '#101115',
      main: '#90CAF9',
      dark: 'rgba(66, 165, 245, 1)',
      light: 'rgb(130, 185, 255)',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#29B6F6',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#0C0C10',
      paper: '#2E2E2E',
      paper2: '#101115',
      unSelected: '#333336',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgb(179, 179, 179)',
      tertiary: '#757575',
    },
    action: {
      selected: 'rgba(255, 255, 255, 0.16)',
      active: '#949496',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
        },
      }),
    },
  },
});

export { lightTheme, darkTheme };
