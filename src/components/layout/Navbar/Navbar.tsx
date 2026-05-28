import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { useAuth } from 'qapp-core';
import React from 'react';
import { useIsSmall } from '../../../hooks/useIsSmall.tsx';
import { isSideBarExpandedAtom } from '../../../state/global/navbar.ts';
import { DownloadTaskManager } from '../../common/DownloadTaskManager';
import { Notifications } from '../../common/Notifications/Notifications';
import { COLLAPSED_WIDTH } from '../Sidenav/Sidenav.tsx';
import { Names } from './../../../state/global/names.ts';
import { PublishMenu } from './Components/PublishMenu.tsx';
import { QtubeLogo } from './Components/QtubeLogo.tsx';
import { UserMenu } from './Components/UserMenu.tsx';
import { CustomAppBar } from './Navbar-styles';
import { Search } from './Search.tsx';

interface Props {
  allNames: Names;
}

const NavBar: React.FC<Props> = ({ allNames }) => {
  const isSmall = useIsSmall();
  const { name, avatarUrl } = useAuth();

  const isSecure = !!name;
  const gapSize = 10;
  const [isSideBarExpanded, setIsSideBarExpanded] = useAtom(
    isSideBarExpandedAtom
  );
  const handleDrawerOpen = (e) => {
    e.stopPropagation();
    setIsSideBarExpanded((prev) => !prev);
  };

  return (
    <CustomAppBar position="sticky" elevation={1}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: COLLAPSED_WIDTH - 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: '1px',
          }}
        >
          <IconButton
            disableRipple={true}
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              color: isSideBarExpanded ? 'text.primary' : 'action.active',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: `${gapSize}px`,
            // padding: '10px',
          }}
        >
          <QtubeLogo />
          {!isSmall && <Search />}

          <Box
            sx={{
              display: 'flex',
              gap: `${isSmall ? gapSize : gapSize * 2}px`,
              alignItems: 'center',
            }}
          >
            {isSmall && <Search />}
            <PublishMenu isDisplayed={isSecure} />

            {isSecure && <Notifications />}
            {!isSmall && <DownloadTaskManager />}
            {!isSmall && (
              <UserMenu
                isShowMenu={isSecure}
                userAvatar={avatarUrl}
                userName={name}
                allNames={allNames}
              />
            )}
          </Box>
        </Box>
      </Box>
    </CustomAppBar>
  );
};

export default NavBar;
