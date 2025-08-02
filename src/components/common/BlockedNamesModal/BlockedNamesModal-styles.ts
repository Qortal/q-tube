import { styled } from '@mui/system';
import { Box, Modal, Typography } from '@mui/material';

export const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  width: '40%',
  '&:focus': {
    outline: 'none',
  },
}));

export const ModalText = styled(Typography)(({ theme }) => ({
  fontSize: '25px',
  color: theme.palette.text.primary,
}));
