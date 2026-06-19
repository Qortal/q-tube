import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { useAuth } from 'qapp-core';
import { useRef, useState } from 'react';
import { Names } from '../../../state/global/names.ts';
import { PopMenu, PopMenuRefType } from '../PopMenu.tsx';
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
} from '../../layout/Navbar/Navbar-styles.tsx';

export interface NameSelectorProps {
  allNames: Names;
  isShowCurrentName?: boolean;
}

export const NameSelector = ({
  allNames,
  isShowCurrentName = false,
}: NameSelectorProps) => {
  const theme = useTheme();
  const { name, avatarUrl, switchName } = useAuth();
  const popMenuRef = useRef<PopMenuRefType>(null);

  const handleNameSelect = (selectedName: string) => {
    switchName(selectedName);
    popMenuRef.current?.closePopover();
  };

  const renderMenuHeader = () => {
    const userAvatar = `/arbitrary/THUMBNAIL/${encodeURIComponent(name || '')}/qortal_avatar`;
    
    if (isShowCurrentName) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Avatar
            sx={{
              height: '40px',
              width: '40px',
            }}
            src={avatarUrl || userAvatar}
          >
            {name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontSize: '16px',
              color: 'text.primary',
            }}
          >
            {name}
          </Typography>
        </Box>
      );
    }

    return (
      <Avatar
        sx={{
          height: '40px',
          width: '40px',
        }}
        src={avatarUrl || userAvatar}
      >
        {name?.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  return (
    <PopMenu
      ref={popMenuRef}
      MenuHeader={renderMenuHeader()}
      showExpandIcon={isShowCurrentName}
    >
      {allNames.map((nameItem) => (
        <DropdownContainer
          key={nameItem.name}
          onClick={() => handleNameSelect(nameItem.name)}
        >
          <Avatar
            src={`/arbitrary/THUMBNAIL/${encodeURIComponent(nameItem.name)}/qortal_avatar`}
            alt={`${nameItem.name}'s avatar`}
            imgProps={{
              onError: (e) => {
                e.currentTarget.src = '';
              },
            }}
          >
            {nameItem.name?.charAt(0).toUpperCase()}
          </Avatar>
          <DropdownText>{nameItem.name}</DropdownText>
        </DropdownContainer>
      ))}
    </PopMenu>
  );
};