import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    paper2: string;
    unSelected: string;
  }
  interface TypeText {
    tertiary: string;
  }
  interface Palette {
    superlike: {
      main: string;
    };
  }
  interface PaletteOptions {
    superlike?: {
      main?: string;
    };
  }
}
