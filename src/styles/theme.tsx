import { createTheme } from "@mui/material/styles";

const commonThemeOptions = {
  typography: {
    fontFamily: [
      "Cambon Light",
      "Raleway, sans-serif",
      "Karla",
      "Merriweather Sans",
      "Proxima Nova",
      "Oxygen",
      "Catamaran",
      "Cairo",
      "Arial"
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 600
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 500
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 500
    },
    body1: {
      fontSize: "23px",
      fontFamily: "Raleway",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.5px"
    },

    body2: {
      fontSize: "18px",
      fontFamily: "Raleway, Arial",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: "0.2px"
    }
  },
  spacing: 8,
  shape: {
    borderRadius: 4
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "inherit",
          transition: "filter 0.3s ease-in-out",
          "&:hover": {
            filter: "brightness(1.1)"
          }
        }
      },
      defaultProps: {
        disableElevation: true,
        disableRipple: true
      }
    }
  }
};

const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff",
      dark: "#F5F5F5",
      light: "#FCFCFC"
    },
    secondary: {
      main: "#417Ed4",
      dark: "#3e74c1"
    },
    background: {
      default: "#fcfcfc",
      paper: "#F5F5F5"
    },
    text: {
      primary: "#000000",
      secondary: "#525252"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;",
          borderRadius: "8px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;"
          }
        }
      }
    },
    MuiIcon: {
      defaultProps: {
        style: {
          color: "#000000"
        }
      }
    }
  }
});

const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "dark",
    primary: {
      main: "#2e3d60",
      dark: "#1a2744",
      light: "#353535"
    },
    secondary: {
      main: "#417Ed4",
      dark: "#3e74c1"
    },

    background: {
      default: "#111111",
      paper: "#1A1C1E"
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "8px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            boxShadow:
              " 0px 3px 4px 0px hsla(0,0%,0%,0.14), 0px 3px 3px -2px hsla(0,0%,0%,0.12), 0px 1px 8px 0px hsla(0,0%,0%,0.2);"
          }
        }
      }
    },
    MuiIcon: {
      defaultProps: {
        style: {
          color: "#ffffff"
        }
      }
    }
  }
});

export { lightTheme, darkTheme };
