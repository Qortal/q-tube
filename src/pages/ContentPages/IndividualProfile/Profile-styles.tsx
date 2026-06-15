import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const ProfileContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));
