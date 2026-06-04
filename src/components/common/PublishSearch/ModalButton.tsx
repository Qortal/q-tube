import CloseIcon from '@mui/icons-material/Close';

import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Modal,
  styled,
  SxProps,
  Theme,
} from '@mui/material';
import { PropsWithChildren } from 'react';

export interface ModalButtonProps extends ButtonProps {
  label: string;
  onOpen?: () => void;
  onClose?: () => void;
  buttonSX?: SxProps<Theme>;
  bodySX?: SxProps<Theme>;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  isDisableClose?: boolean;
}

export const ModalBody = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.default,
  borderRadius: '4px',
  top: '2%',
  left: '5%',
  width: '90%',
  display: 'flex',
  flexDirection: 'column',
  gap: '17px',
  overflowY: 'auto',
  maxHeight: '95vh',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)'
      : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-track:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar': {
    width: '16px',
    height: '10px',
    backgroundColor: theme.palette.mode === 'light' ? '#f6f8fa' : '#292d3e',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'light' ? '#d3d9e1' : '#575757',
    borderRadius: '8px',
    backgroundClip: 'content-box',
    border: '4px solid transparent',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#b7bcc4' : '#474646',
  },
}));

export const ModalButton = ({
  label,
  onOpen,
  onClose,
  buttonSX,
  bodySX,
  children,
  disabled,
  isOpen,
  setIsOpen,
  isDisableClose,
  onClick,
  ...buttonProps
}: PropsWithChildren<ModalButtonProps>) => {
  return (
    <>
      <Button
        sx={{
          ...buttonSX,
        }}
        onClick={(e) => {
          if (onClick) onClick(e);

          setIsOpen(true);
          if (onOpen) onOpen();
        }}
        disabled={disabled || isOpen}
        {...buttonProps}
      >
        {label}
      </Button>
      <Modal
        open={isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onClose={() => {
          setIsOpen(false);
          if (onClose && !isDisableClose) onClose();
        }}
      >
        <ModalBody sx={bodySX}>
          <>
            <IconButton
              disabled={isDisableClose}
              aria-label="close"
              onClick={(e) => {
                if (onClick) onClick(e);
                setIsOpen(false);
                if (onClose) onClose();
              }}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            {children}
          </>
        </ModalBody>
      </Modal>
    </>
  );
};
