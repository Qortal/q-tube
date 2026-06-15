import { AppBar, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { DarkModeSVG } from '../../../assets/svgs/DarkModeSVG';
import { LightModeSVG } from '../../../assets/svgs/LightModeSVG';
import { fontSizeSmall } from '../../../constants/Misc.ts';

export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  width: '100%',
  padding: '5px 5px 5px 5px',
  backgroundImage: 'none',
  backgroundColor: theme.palette.background.paper2,
  height: '65px',
}));
export const LogoContainer = styled('div')({
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const CustomTitle = styled(Typography)({
  fontWeight: 600,
  color: '#000000',
});

const AuthenticateButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '8px 15px',
  borderRadius: '40px',
  gap: '4px',
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  transition: 'all 0.3s ease-in-out',
  boxShadow: 'none',
  '&:hover': {
    cursor: 'pointer',
    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;',
    backgroundColor: theme.palette.secondary.dark,
    filter: 'brightness(1.1)',
  },
}));

export const AvatarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
    '& #expand-icon': {
      transition: 'all 0.3s ease-in-out',
      filter: 'brightness(0.7)',
    },
  },
});

export const DropdownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  backgroundColor: theme.palette.background.paper,
  padding: '10px 15px',
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    filter:
      theme.palette.mode === 'light' ? 'brightness(0.95)' : 'brightness(1.1)',
  },
}));

export const DropdownText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
  userSelect: 'none',
}));

const NavbarName = styled(Typography)(({ theme }) => ({
  fontSize: fontSizeSmall,
  color: theme.palette.text.primary,
  marginRight: '10px',
}));

export const ThemeSelectRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  height: '100%',
});

const LightModeIcon = styled(LightModeSVG)(({ theme }) => ({
  transition: 'all 0.1s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    filter:
      theme.palette.mode === 'dark'
        ? 'drop-shadow(0px 4px 6px rgba(255, 255, 255, 0.6))'
        : 'drop-shadow(0px 4px 6px rgba(99, 88, 88, 0.1))',
  },
}));

const DarkModeIcon = styled(DarkModeSVG)(({ theme }) => ({
  transition: 'all 0.1s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    filter:
      theme.palette.mode === 'dark'
        ? 'drop-shadow(0px 4px 6px rgba(255, 255, 255, 0.6))'
        : 'drop-shadow(0px 4px 6px rgba(99, 88, 88, 0.1))',
  },
}));
