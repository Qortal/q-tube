import { Button, List, ListItem, Typography, useTheme } from '@mui/material';
import { useBlockedNames } from 'qapp-core';
import React, { useState } from 'react';
import {
  ModalContent,
  ModalText,
  StyledModal,
} from './BlockedNamesModal-styles';

interface PostModalProps {
  open: boolean;
  onClose: () => void;
}

export const BlockedNamesModal: React.FC<PostModalProps> = ({
  open,
  onClose,
}) => {
  const { removeFromBlockedList } = useBlockedNames();
  const [blockedNames, setBlockedNames] = useState<string[]>([]);
  const theme = useTheme();
  const getBlockedNames = React.useCallback(async () => {
    try {
      const listName = `blockedNames`;
      const response = await qortalRequest({
        action: 'GET_LIST_ITEMS',
        list_name: listName,
      });
      setBlockedNames(response);
    } catch (error) {
      onClose();
    }
  }, []);

  React.useEffect(() => {
    getBlockedNames();
  }, [getBlockedNames]);

  const removeFromBlockList = async (name: string) => {
    try {
      const response = await removeFromBlockedList([name]);

      if (response === true) {
        setBlockedNames((prev) => prev.filter((n) => n !== name));
      }
    } catch (error) {}
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <ModalText>Manage blocked names</ModalText>
        <List
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            overflow: 'auto',
          }}
        >
          {blockedNames.map((name, index) => (
            <ListItem
              key={name + index}
              sx={{
                display: 'flex',
              }}
            >
              <Typography>{name}</Typography>
              <Button
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.text.primary,
                }}
                onClick={() => removeFromBlockList(name)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </ModalContent>
    </StyledModal>
  );
};
