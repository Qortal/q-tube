import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import { DownloadTaskManager } from '../../common/DownloadTaskManager';
import { Notifications } from '../../common/Notifications/Notifications';
import { PublishMenu } from './Components/PublishMenu.tsx';
import { QtubeLogo } from './Components/QtubeLogo.tsx';
import { UserMenu } from './Components/UserMenu.tsx';
import { CustomAppBar } from './Navbar-styles';
import { Names } from './../../../state/global/names.ts';

interface Props {
  isAuthenticated: boolean;
  userName: string | null;
  allNames: Names;
  userAvatar: string;
  authenticate: () => void;
}

const NavBar: React.FC<Props> = ({
  isAuthenticated,
  userName,
  allNames,
  userAvatar,
}) => {
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  const isSecure = isAuthenticated && !!userName;
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
            userAvatar={userAvatar}
            userName={userName}
            allNames={allNames}
          />
          <PublishMenu isDisplayed={isSecure} />
        </Box>
      </Box>
    </CustomAppBar>
  );
};

export default NavBar;
