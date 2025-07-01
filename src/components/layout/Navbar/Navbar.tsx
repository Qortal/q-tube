import {
  alpha,
  Box,
  IconButton,
  InputBase,
  styled,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';
import { DownloadTaskManager } from '../../common/DownloadTaskManager';
import { Notifications } from '../../common/Notifications/Notifications';
import { PublishMenu } from './Components/PublishMenu.tsx';
import { QtubeLogo } from './Components/QtubeLogo.tsx';
import { UserMenu } from './Components/UserMenu.tsx';
import { CustomAppBar } from './Navbar-styles';
import { Names } from './../../../state/global/names.ts';
import { useAuth } from 'qapp-core';
import { useAtom, useSetAtom } from 'jotai';
import { isSideBarExpandedAtom } from '../../../state/global/navbar.ts';
import MenuIcon from '@mui/icons-material/Menu';
import { COLLAPSED_WIDTH } from '../Sidenav/Sidenav.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useSidebarState } from '../../../pages/Home/Components/SearchSidebar-State.ts';

interface Props {
  allNames: Names;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  marginLeft: 0,
  padding: '0px 12px',
  height: '90%',
  width: '100%',
  outline: `1px ${theme.palette.action.active} solid`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  // height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
    },
  },
}));

const NavBar: React.FC<Props> = ({ allNames }) => {
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  const { name, avatarUrl } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const isSecure = !!name;
  const gapSize = 10;
  const [isSideBarExpanded, setIsSideBarExpanded] = useAtom(
    isSideBarExpandedAtom
  );
  const handleDrawerOpen = (e) => {
    e.stopPropagation();
    setIsSideBarExpanded((prev) => !prev);
  };

  const {
    filterSearch,
    filterName,
    filterType,
    setFilterSearch,
    setFilterName,
    selectedCategoryVideos,
    handleOptionCategoryChangeVideos,
    selectedSubCategoryVideos,
    handleOptionSubCategoryChangeVideos,
    setFilterType,
    onSearch,
    onReset,
  } = useSidebarState();

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onSearch();
      navigate(`/`);
    }
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
            padding: '10px',
          }}
        >
          <QtubeLogo />
          <Search>
            <SearchIconWrapper>
              <SearchIcon
                sx={{
                  color: 'action.active',
                }}
              />
            </SearchIconWrapper>
            <StyledInputBase
              size="small"
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </Search>
          <Box
            sx={{
              display: 'flex',
              gap: `${isScreenSmall ? gapSize : gapSize * 2}px`,
              alignItems: 'center',
            }}
          >
            {isSecure && <Notifications />}

            <DownloadTaskManager />

            <PublishMenu isDisplayed={isSecure} />
            <UserMenu
              isShowMenu={isSecure}
              userAvatar={avatarUrl}
              userName={name}
              allNames={allNames}
            />
          </Box>
        </Box>
      </Box>
    </CustomAppBar>
  );
};

export default NavBar;
