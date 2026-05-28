import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useAtom } from 'jotai';
import React, { FC } from 'react';
import { EnumTheme, themeAtom } from '../state/global/theme';
import { darkTheme, lightTheme } from './theme';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

const ThemeProviderWrapper: FC<ThemeProviderWrapperProps> = ({ children }) => {
  const [theme] = useAtom(themeAtom);

  return (
    <ThemeProvider theme={theme === EnumTheme.LIGHT ? lightTheme : darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;
