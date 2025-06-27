import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { DownloadTaskManager } from '../../common/DownloadTaskManager';
import { Notifications } from '../../common/Notifications/Notifications';
import { PublishMenu } from './Components/PublishMenu.tsx';
import { QtubeLogo } from './Components/QtubeLogo.tsx';
import { UserMenu } from './Components/UserMenu.tsx';
import { CustomAppBar } from './Navbar-styles';
import { Names } from './../../../state/global/names.ts';
import { useAuth } from 'qapp-core';

interface Props {
  allNames: Names;
}

const NavBar: React.FC<Props> = ({ allNames }) => {
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  const { name, avatarUrl } = useAuth();
  const isSecure = !!name;
  const gapSize = 10;

  return (
    <CustomAppBar position="sticky" elevation={2}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          gap: `${gapSize}px`,
        }}
      >
        <QtubeLogo />
        <Box
          sx={{
            display: 'flex',
            gap: `${isScreenSmall ? gapSize : gapSize * 2}px`,
            alignItems: 'center',
          }}
        >
          {isSecure && <Notifications />}

          <DownloadTaskManager />
          <UserMenu
            isShowMenu={isSecure}
            userAvatar={avatarUrl}
            userName={name}
            allNames={allNames}
          />
          <PublishMenu isDisplayed={isSecure} />
        </Box>
      </Box>
    </CustomAppBar>
  );
};

export default NavBar;
